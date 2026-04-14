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
      </div>
      <!-- Editor content -->
      <EditorContent :editor="editor" class="tiptap-editor min-h-[200px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2, Heading3,
  Quote, Code, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Undo, Redo
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
