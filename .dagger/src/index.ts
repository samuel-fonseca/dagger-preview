import { dag, Container, Directory, argument, object, func, Qr } from '@dagger.io/dagger'

@object()
export class DaggerPreview {
  /**
   * Publish the application container after building and testing it on-the-fly
   */
  @func()
  async publish(@argument({ defaultPath: '.' }) source: Directory): Promise<string> {
    await this.test(source)
    let url = await this.build(source).publish(
      'ttl.sh/myapp-' + Math.floor(Math.random() * 10000000)
    )
    //return dag.qr().generateAsciiQr(url)
	return url
  }

  /**
   * Build the application container
   */
  @func()
  build(@argument({ defaultPath: '.' }) source: Directory): Container {
    const build = this.buildEnv(source).withExec(['npm', 'run', 'build']).directory('./dist')
    return dag
      .container()
      .from('nginx:1.25-alpine')
      .withDirectory('/usr/share/nginx/html', build)
      .withExposedPort(80)
  }

  /**
   * Return the result of running unit tests
   */
  @func()
  async test(source: Directory): Promise<string> {
    return this.buildEnv(source).withExec(['npm', 'run', 'test:unit', 'run']).stdout()
  }

  /**
   * Build a ready-to-use development environment
   */
  @func()
  buildEnv(source: Directory): Container {
    const nodeCache = dag.cacheVolume('node')
    return dag
      .container()
      .from('node:21-slim')
      .withDirectory('/src', source)
      .withMountedCache('/root/.npm', nodeCache)
      .withWorkdir('/src')
      .withExec(['npm', 'install'])
  }
}