<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { usePage } from '@inertiajs/vue3'
import type { Data } from '@generated/data'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SecuritySettings from '@/components/SecuritySettings.vue'
import UserLimits from '@/components/UserLimits.vue'

defineOptions({ layout: DashboardLayout })

const props = defineProps<{
  apiKey: string | null
  hasHmac: boolean
}>()

const page = usePage<Data.SharedProps>()
</script>

<template>
  <Head title="Profile" />
  
  <div class="flex items-center justify-between space-y-2 mb-6">
    <h2 class="text-3xl font-bold tracking-tight">Profile</h2>
  </div>

  <div class="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Informasi Pribadi</CardTitle>
        <CardDescription>
          Perbarui nama dan alamat email profil akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Nama</Label>
          <Input id="name" :default-value="page.props.user?.fullName ?? ''" />
        </div>
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" :default-value="page.props.user?.email ?? ''" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Simpan Perubahan</Button>
      </CardFooter>
    </Card>

    <UserLimits />

    <div class="mt-4">
      <SecuritySettings :api-key="apiKey" :has-hmac="hasHmac" />
    </div>
  </div>
</template>
