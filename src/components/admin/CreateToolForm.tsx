import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wrench } from 'lucide-react';

interface ToolFormData {
  name: string;
  description: string;
  type: 'internal' | 'iframe';
  iframe_url?: string;
  api_endpoint?: string;
  icon_url?: string;
}

interface CreateToolFormProps {
  onSubmit: (data: ToolFormData) => Promise<void>;
  onCancel?: () => void;
}

export const CreateToolForm: React.FC<CreateToolFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    description: '',
    type: 'internal',
    iframe_url: '',
    api_endpoint: '',
    icon_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof ToolFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Tool name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (formData.type === 'iframe' && !formData.iframe_url?.trim()) {
      setError('iFrame URL is required for external tools');
      return;
    }
    if (formData.type === 'internal' && !formData.api_endpoint?.trim()) {
      setError('API endpoint is required for internal tools');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tool');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Create New Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Tool Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter tool name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what this tool does"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tool Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleChange('type', value as 'internal' | 'iframe')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal (API)</SelectItem>
                <SelectItem value="iframe">External (iFrame)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'iframe' ? (
            <div className="space-y-2">
              <Label htmlFor="iframe_url">iFrame URL *</Label>
              <Input
                id="iframe_url"
                value={formData.iframe_url}
                onChange={(e) => handleChange('iframe_url', e.target.value)}
                placeholder="https://example.com/tool"
                type="url"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="api_endpoint">API Endpoint *</Label>
              <Input
                id="api_endpoint"
                value={formData.api_endpoint}
                onChange={(e) => handleChange('api_endpoint', e.target.value)}
                placeholder="/api/tools/custom-tool"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="icon_url">Icon URL (Optional)</Label>
            <Input
              id="icon_url"
              value={formData.icon_url}
              onChange={(e) => handleChange('icon_url', e.target.value)}
              placeholder="https://example.com/icon.png"
              type="url"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Tool'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
