---
title: Vue 3 Composition API 入门指南
date: 2025-02-10 09:00:00
tags:
  - Vue
  - JavaScript
  - 前端
categories:
  - 前端开发
---

Vue 3 引入了 Composition API，这是一种新的编写组件逻辑的方式。本文将介绍 Composition API 的基本用法。

## 为什么需要 Composition API？

传统的 Options API 在处理复杂组件时可能会出现逻辑分散的问题。Composition API 允许我们将相关逻辑组织在一起。

## 核心函数

### setup()

`setup()` 是 Composition API 的入口点，在组件实例创建之前执行。

```javascript
export default {
  setup() {
    // 在这里编写组合式逻辑
    return {
      // 返回的值可以在模板中使用
    }
  }
}
```

### ref 和 reactive

```javascript
import { ref, reactive } from 'vue'

// 响应式引用
const count = ref(0)
const message = ref('Hello')

// 响应式对象
const state = reactive({
  name: 'Vue',
  version: '3.0'
})
```

### computed

```javascript
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
```

### watch

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
})
```

### 生命周期钩子

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component mounted')
})

onUpdated(() => {
  console.log('Component updated')
})

onUnmounted(() => {
  console.log('Component unmounted')
})
```

## 总结

Composition API 提供了更灵活的方式来组织组件逻辑，特别适合处理复杂组件。
