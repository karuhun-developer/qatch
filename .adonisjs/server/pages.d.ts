import '@adonisjs/inertia/types'

import type { VNodeProps, AllowedComponentProps, ComponentInstance } from 'vue'

type ExtractProps<T> = Omit<
  ComponentInstance<T>['$props'],
  keyof VNodeProps | keyof AllowedComponentProps
>

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.vue'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.vue'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.vue'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.vue'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.vue'))['default']>
    'dashboard': ExtractProps<(typeof import('../../inertia/pages/dashboard.vue'))['default']>
    'profile': ExtractProps<(typeof import('../../inertia/pages/profile.vue'))['default']>
    'roles/index': ExtractProps<(typeof import('../../inertia/pages/roles/index.vue'))['default']>
    'users/index': ExtractProps<(typeof import('../../inertia/pages/users/index.vue'))['default']>
    'qris/index': ExtractProps<(typeof import('../../inertia/pages/qris/index.vue'))['default']>
    'qris-dynamic/index': ExtractProps<(typeof import('../../inertia/pages/qris-dynamic/index.vue'))['default']>
  }
}
