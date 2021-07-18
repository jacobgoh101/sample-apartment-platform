<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ item.name }}</p>
        </div>
      </div>
      <div class="content">
        {{ item.description }}
      </div>
      <div>
        <IconText
          icon="mdi mdi-information"
          title="square meter"
          class="is-block mb-1"
        >
          {{ item.floorAreaSquareMeter }} SQM
        </IconText>
        <IconText icon="mdi mdi-currency-usd" class="is-block mb-1">
          USD {{ item.pricePerMonth }}
        </IconText>
        <IconText icon="mdi mdi-home-heart" class="is-block mb-1">
          {{ item.numOfRooms }} room(s)
        </IconText>
        <IconText icon="mdi mdi-human-greeting" class="is-block mb-1">
          <a :href="`mailto:${item.realtor.email}`">
            Contact {{ item.realtor.name }} (Realtor)
          </a>
        </IconText>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import IconText from '@/components/IconText.vue';

export default defineComponent({
  components: { IconText },
  props: { item: Object },
  setup() {
    return;
  },
});
</script>

<style lang="scss" scoped></style>
