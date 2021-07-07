import throttle from 'lodash/throttle';
import { createEventHook } from '@vueuse/core';
import { onMounted, onUnmounted } from 'vue-demi';

export const useScrollToBottom = (buffer = 100) => {
  const scrollToBottom = createEventHook<void>();

  const scrollHandler = throttle(function () {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - buffer
    ) {
      scrollToBottom.trigger();
    }
  }, 300);

  onMounted(() => window.addEventListener('scroll', scrollHandler));
  onUnmounted(() => window.removeEventListener('scroll', scrollHandler));

  return {
    onScrollToBottom: scrollToBottom.on,
  };
};
