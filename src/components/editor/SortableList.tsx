import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
  dragHandleClass?: string;
};

/** 单个可拖拽项：外层 + 右上角删除按钮 */
export function SortableItem({ id, children, onRemove }: SortableItemProps) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div
        {...attributes}
        {...listeners}
        className="drag-handle"
        title={t('editor.field.dragSort')}
        aria-label={t('editor.field.dragSort')}
      >
        ⋮⋮
      </div>
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="remove-btn"
        title={t('editor.field.dragSortDelete')}
        aria-label={t('editor.field.dragSortDelete')}
      >
        ✕
      </button>
    </div>
  );
}

type SortableListProps<T> = {
  /** 项数组（useFieldArray 返回的 fields 通常带 id） */
  items: Array<T & { id: string | number }>;
  /** 每个项渲染回调，回传项、字段索引 */
  children: (item: T & { id: string | number }, index: number) => React.ReactNode;
  /** 当拖拽重排后，调用 fields.swap / useFieldArray.move 的封装 */
  onReorder: (from: number, to: number) => void;
  /** 删除某项 */
  onRemove: (index: number) => void;
  /** "新增"按钮内容 */
  addButtonLabel: string;
  /** 新增某项回调 */
  onAdd: () => void;
  /** 横向或纵向（默认纵向） */
  orientation?: 'vertical' | 'horizontal';
};

/**
 * 通用拖拽列表外壳。
 * 与 react-hook-form 的 useFieldArray 配合使用：
 *   const { fields, append, remove, move } = useFieldArray(...);
 *   <SortableList items={fields} onReorder={(a,b)=>move(a,b)} onRemove={(i)=>remove(i)} onAdd={()=>append(emptyItem())} ...>
 */
export function SortableList<T>({
  items,
  children,
  onReorder,
  onRemove,
  addButtonLabel,
  onAdd,
  orientation = 'vertical',
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (over && active.id !== over.id) {
        const from = items.findIndex((i) => String(i.id) === String(active.id));
        const to = items.findIndex((i) => String(i.id) === String(over.id));
        if (from >= 0 && to >= 0 && from !== to) {
          // dnd-kit 的 arrayMove 语义与 useFieldArray.move 一致
          const moved = arrayMove(items, from, to);
          // 逐项 move：从原位置移动到新位置
          const min = Math.min(from, to);
          const max = Math.max(from, to);
          for (let i = min; i <= max; i++) {
            const expectedId = moved[i];
            const actualId = items[i];
            if (String(expectedId.id) !== String(actualId.id)) {
              onReorder(i, items.findIndex((f) => String(f.id) === String(expectedId.id)));
              return;
            }
          }
        }
      }
    },
    [items, onReorder],
  );

  const strategy =
    orientation === 'horizontal'
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  return (
    <div className="sortable-list">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((i) => String(i.id))}
          strategy={strategy}
        >
          {items.map((item, idx) => (
            <SortableItem
              key={String(item.id)}
              id={String(item.id)}
              onRemove={() => onRemove(idx)}
            >
              {children(item, idx)}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={onAdd}
        className="add-btn"
      >
        + {addButtonLabel}
      </button>
    </div>
  );
}
