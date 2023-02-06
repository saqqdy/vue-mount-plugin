import MountPlugin from './Mount'
import { withInstall } from './utils/vue'

const Mount = withInstall(MountPlugin)

export { Mount, Mount as default }
