import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faShoePrints, faBars, faCheck, faEllipsisH, faPhoneAlt, faEnvelope, faMapMarkerAlt, faSearchLocation, faShieldAlt, faTruck } from '@fortawesome/free-solid-svg-icons'

// Tambahkan ikon yang digunakan ke library
library.add(faShoePrints, faBars, faCheck, faEllipsisH, faPhoneAlt, faEnvelope, faMapMarkerAlt, faSearchLocation, faShieldAlt, faTruck, faInstagram, faWhatsapp, faFacebook, faTruck)

// Prevent fontawesome from adding its CSS since we did it manually
config.autoAddCss = false