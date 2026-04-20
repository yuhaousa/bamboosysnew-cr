<template>
  <div class="space-y-4">
    <div class="border rounded-xl overflow-hidden dark:border-gray-700">
      <!-- Toolbar -->
      <div class="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <button v-for="btn in toolbarButtons" :key="btn.action" @click="runAction(btn.action)" :title="btn.title"
          class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors"
          :class="editor?.isActive(btn.active ?? btn.action) ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100' : ''"
        >
          <component :is="btn.icon" class="w-4 h-4" />
        </button>

        <!-- Divider -->
        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-0.5 self-stretch" />

        <!-- Text color picker -->
        <label class="relative p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center" title="Text Color">
          <Type class="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span class="absolute bottom-1 left-1.5 right-1.5 h-1 rounded-sm" :style="{ backgroundColor: activeTextColor || '#000' }" />
          <input type="color" class="sr-only" :value="activeTextColor || '#000000'"
            @input="setTextColor(($event.target as HTMLInputElement).value)" />
        </label>

        <!-- Clear text color -->
        <button @click="clearTextColor" title="Remove text color"
          class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 transition-colors text-xs font-bold">
          A
        </button>

        <!-- Divider -->
        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-0.5 self-stretch" />

        <!-- Highlight color picker -->
        <label class="relative p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center" title="Highlight Color">
          <Highlighter class="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span class="absolute bottom-1 left-1.5 right-1.5 h-1 rounded-sm" :style="{ backgroundColor: activeHighlight || '#ffff00' }" />
          <input type="color" class="sr-only" :value="activeHighlight || '#ffff00'"
            @input="setHighlight(($event.target as HTMLInputElement).value)" />
        </label>

        <!-- Clear highlight -->
        <button @click="clearHighlight" title="Remove highlight"
          class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
      <!-- Editor content -->
      <EditorContent :editor="editor" class="tiptap-editor min-h-[200px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2, Heading3,
  Quote, Code, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Undo, Redo,
  Type, Highlighter, X
} from 'lucide-vue-next'
import type { RichTextContent } from '@shared/types'

const props = defineProps<{ content: RichTextContent }>()
const emit = defineEmits<{ update: [RichTextContent] }>()

const editor = useEditor({
  content: props.content.html || '<p></p>',
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
  ],
  onUpdate: ({ editor }) => {
    emit('update', { html: editor.getHTML() })
  },
})

watch(() => props.content.html, (html) => {
  if (editor.value && editor.value.getHTML() !== html) {
    editor.value.commands.setContent(html || '<p></p>', false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())

const activeTextColor = computed(() => editor.value?.getAttributes('textStyle')?.color ?? '')
const activeHighlight = computed(() => editor.value?.getAttributes('highlight')?.color ?? '')

function setTextColor(color: string) {
  editor.value?.chain().focus().setColor(color).run()
}
function clearTextColor() {
  editor.value?.chain().focus().unsetColor().run()
}
function setHighlight(color: string) {
  editor.value?.chain().focus().setHighlight({ color }).run()
}
function clearHighlight() {
  editor.value?.chain().focus().unsetHighlight().run()
}

const toolbarButtons = [
  { action: 'bold', title: 'Bold', icon: Bold, active: 'bold' },
  { action: 'italic', title: 'Italic', icon: Italic, active: 'italic' },
  { action: 'underline', title: 'Underline', icon: UnderlineIcon, active: 'underline' },
  { action: 'h2', title: 'Heading 2', icon: Heading2, active: 'heading' },
  { action: 'h3', title: 'Heading 3', icon: Heading3, active: 'heading' },
  { action: 'bulletList', title: 'Bullet List', icon: List, active: 'bulletList' },
  { action: 'orderedList', title: 'Ordered List', icon: ListOrdered, active: 'orderedList' },
  { action: 'blockquote', title: 'Quote', icon: Quote, active: 'blockquote' },
  { action: 'code', title: 'Code', icon: Code, active: 'code' },
  { action: 'alignLeft', title: 'Align Left', icon: AlignLeft, active: 'left' },
  { action: 'alignCenter', title: 'Align Center', icon: AlignCenter, active: 'center' },
  { action: 'alignRight', title: 'Align Right', icon: AlignRight, active: 'right' },
  { action: 'undo', title: 'Undo', icon: Undo, active: '' },
  { action: 'redo', title: 'Redo', icon: Redo, active: '' },
]

function runAction(action: string) {
  if (!editor.value) return
  const chain = editor.value.chain().focus()
  const actions: Record<string, () => void> = {
    bold: () => chain.toggleBold().run(),
    italic: () => chain.toggleItalic().run(),
    underline: () => chain.toggleUnderline().run(),
    h2: () => chain.toggleHeading({ level: 2 }).run(),
    h3: () => chain.toggleHeading({ level: 3 }).run(),
    bulletList: () => chain.toggleBulletList().run(),
    orderedList: () => chain.toggleOrderedList().run(),
    blockquote: () => chain.toggleBlockquote().run(),
    code: () => chain.toggleCode().run(),
    alignLeft: () => chain.setTextAlign('left').run(),
    alignCenter: () => chain.setTextAlign('center').run(),
    alignRight: () => chain.setTextAlign('right').run(),
    undo: () => chain.undo().run(),
    redo: () => chain.redo().run(),
  }
  actions[action]?.()
}
</script>
    h3: () => chain.toggleHeading({ level: 3 }).run(),
    bulletList: () => chain.toggleBulletList().run(),
    orderedList: () => chain.toggleOrderedList().run(),
    blockquote: () => chain.toggleBlockquote().run(),
    code: () => chain.toggleCode().run(),
    alignLeft: () => chain.setTextAlign('left').run(),
    alignCenter: () => chain.setTextAlign('center').run(),
    alignRight: () => chain.setTextAlign('right').run(),
    undo: () => chain.undo().run(),
    redo: () => chain.redo().run(),
  }
  actions[action]?.()
}
</script>
