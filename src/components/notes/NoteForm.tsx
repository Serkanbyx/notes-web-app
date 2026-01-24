import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema, type NoteSchemaType } from '../../utils/validation';
import Input from '../ui/Input';
import NoteEditor from './NoteEditor';
import TagSelector from '../tags/TagSelector';

interface NoteFormProps {
  initialData?: NoteSchemaType;
  onSubmit: (data: NoteSchemaType) => void;
  onChange?: (data: NoteSchemaType) => void;
}

/**
 * Note form component with validation
 */
function NoteForm({ initialData, onSubmit, onChange }: NoteFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      tags: [],
    },
  });

  // Watch all form values for autosave
  const watchedValues = watch();

  // Call onChange whenever form values change
  useEffect(() => {
    if (onChange) {
      onChange(watchedValues);
    }
  }, [watchedValues, onChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      {/* Title input */}
      <div className="mb-4">
        <Input
          {...register('title')}
          placeholder="Not başlığı"
          error={errors.title?.message}
          className="text-xl font-semibold"
          autoFocus
        />
      </div>

      {/* Tags selector */}
      <div className="mb-4">
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagSelector
              selectedTags={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Content editor */}
      <div className="flex-1 min-h-0">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <NoteEditor
              content={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Hidden submit button (form is submitted via autosave or explicit action) */}
      <button type="submit" className="hidden" aria-hidden="true">
        Kaydet
      </button>
    </form>
  );
}

export default NoteForm;
