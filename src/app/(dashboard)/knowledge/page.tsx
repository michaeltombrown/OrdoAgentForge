import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Upload, Globe, Zap, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  scope: 'global' | 'agent-specific';
  uploaded_at: string;
}

export const KnowledgeBasePage: React.FC = () => {
  const [scope, setScope] = useState<'global' | 'agent-specific'>('global');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // TODO: Implement actual upload to backend
      console.log('Uploading files:', files);
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    // TODO: Implement actual delete
    console.log('Deleting document:', documentId);
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-gray-600 mt-1">
          Upload and manage documents for your AI agents
        </p>
      </div>

      {/* Scope Toggle */}
      <Tabs
        value={scope}
        onValueChange={(value) =>
          setScope(value as 'global' | 'agent-specific')
        }
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global
          </TabsTrigger>
          <TabsTrigger
            value="agent-specific"
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Agent-Specific
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Knowledge Base</CardTitle>
              <p className="text-sm text-gray-600">
                Documents available to all tools and agents in your workspace
              </p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  PDF, TXT, DOCX, and more
                </p>
                <Label htmlFor="global-upload" className="cursor-pointer">
                  <Button disabled={uploading} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Files'}
                    </span>
                  </Button>
                </Label>
                <Input
                  id="global-upload"
                  type="file"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent-specific" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent-Specific Knowledge</CardTitle>
              <p className="text-sm text-gray-600">
                Documents available only to specific agents
              </p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Agent Documents
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  PDF, TXT, DOCX, and more
                </p>
                <Label htmlFor="agent-upload" className="cursor-pointer">
                  <Button disabled={uploading} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Files'}
                    </span>
                  </Button>
                </Label>
                <Input
                  id="agent-upload"
                  type="file"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No documents uploaded yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.scope === 'global' ? 'Global' : 'Agent-Specific'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(doc.uploaded_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
