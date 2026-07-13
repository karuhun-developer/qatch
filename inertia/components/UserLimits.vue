<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import type { Data } from '@generated/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const page = usePage<Data.SharedProps>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Informasi Limit & Paket</CardTitle>
      <CardDescription> Informasi paket langganan Anda dan sisa limit bulan ini. </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-1">
        <Label>Paket Saat Ini</Label>
        <div class="font-medium">{{ page.props.user?.plan?.name || 'Belum memilih paket' }}</div>
      </div>
      <div class="space-y-1">
        <Label>Limit QRIS Statis</Label>
        <div class="font-medium">
          {{ page.props.user?.qrisTotal || 0 }} /
          {{
            page.props.user?.plan?.maxQris === null
              ? 'Unlimited'
              : page.props.user?.plan?.maxQris || 0
          }}
        </div>
      </div>
      <div class="space-y-1">
        <Label>Limit Transaksi / Bulan</Label>
        <div class="font-medium">
          {{ page.props.user?.transactionTotal || 0 }} /
          {{
            page.props.user?.plan?.maxTransactionPerMonth === null
              ? 'Unlimited'
              : page.props.user?.plan?.maxTransactionPerMonth || 0
          }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>
