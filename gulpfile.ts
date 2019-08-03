import { Pure } from './build/gulp.pure'
import { Browser } from './build/gulp.browser'
import { config } from './build/gulp.config'
import { Weapp } from './build/gulp.weapp'

// new Pure(config)
// new Browser(config)
new Weapp(config)
