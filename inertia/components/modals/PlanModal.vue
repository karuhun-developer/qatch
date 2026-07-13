<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import TagInput from '@/components/TagInput.vue'
import { Package } from '@lucide/vue'

const props = defineProps<{
  open: boolean
  plan: {
    id: number
    name: string
    price: number
    description: string | null
    maxQris: number | null
    maxTransactionPerMonth: number | null
    isFeatured: boolean
    features: string[] | null
  } | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = useForm({
  name: '',
  price: 0,
  description: '',
  maxQris: null as number | null,
  maxTransactionPerMonth: null as number | null,
  isFeatured: false,
  features: [] as string[],
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.plan) {
        form.name = props.plan.name
        form.price = props.plan.price
        form.description = props.plan.description || ''
        form.maxQris = props.plan.maxQris
        form.maxTransactionPerMonth = props.plan.maxTransactionPerMonth
        form.isFeatured = !!props.plan.isFeatured
        form.features = props.plan.features || []
      } else {
        form.reset()
      }
    }
  }
)

function submit() {
  if (props.plan) {
    form.put(`/plans/${props.plan.id}`, {
      onSuccess: () => {
        emit('update:open', false)
      },
    })
  } else {
    form.post('/plans', {
      onSuccess: () => {
        emit('update:open', false)
      },
    })
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Package class="h-5 w-5 text-primary" />
          {{ plan ? 'Edit Plan' : 'Create New Plan' }}
        </DialogTitle>
        <DialogDescription>
          {{ plan ? 'Update existing plan details.' : 'Add a new pricing plan.' }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4 pt-4" @submit.prevent="submit">
        <div class="space-y-2">
          <Label for="name">Plan Name</Label>
          <Input id="name" v-model="form.name" placeholder="e.g. Pro, Enterprise" required />
          <p v-if="form.errors.name" class="text-sm text-destructive">{{ form.errors.name }}</p>
        </div>

        <div class="space-y-2">
          <Label for="price">Price (Rp)</Label>
          <Input
            id="price"
            v-model="form.price"
            type="number"
            min="0"
            placeholder="0 for Free"
            required
          />
          <p v-if="form.errors.price" class="text-sm text-destructive">{{ form.errors.price }}</p>
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Input
            id="description"
            v-model="form.description"
            placeholder="Brief description of the plan"
          />
          <p v-if="form.errors.description" class="text-sm text-destructive">
            {{ form.errors.description }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="maxQris">Max QRIS (empty = unlimited)</Label>
            <Input id="maxQris" v-model="form.maxQris" type="number" min="0" placeholder="e.g. 5" />
            <p v-if="form.errors.maxQris" class="text-sm text-destructive">
              {{ form.errors.maxQris }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="maxTransaction">Max Trx/Month (empty = unlimited)</Label>
            <Input
              id="maxTransaction"
              v-model="form.maxTransactionPerMonth"
              type="number"
              min="0"
              placeholder="e.g. 1500"
            />
            <p v-if="form.errors.maxTransactionPerMonth" class="text-sm text-destructive">
              {{ form.errors.maxTransactionPerMonth }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isFeatured"
            :checked="form.isFeatured"
            @update:checked="form.isFeatured = $event"
          />
          <Label for="isFeatured" class="font-normal cursor-pointer text-sm">
            Tandai sebagai Paket Paling Populer (Featured)
          </Label>
        </div>

        <div class="space-y-2">
          <Label>Features (Keuntungan)</Label>
          <TagInput
            v-model="form.features"
            :separators="[',']"
            placeholder="Type feature and press Enter..."
          />
          <p class="text-xs text-muted-foreground mt-1">Press Enter or comma to add a feature.</p>
          <p v-if="form.errors.features" class="text-sm text-destructive">
            {{ form.errors.features }}
          </p>
        </div>

        <div class="flex justify-end pt-4">
          <Button type="button" variant="outline" class="mr-2" @click="emit('update:open', false)">
            Cancel
          </Button>
          <Button type="submit" :disabled="form.processing">
            {{ form.processing ? 'Saving...' : 'Save Plan' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
