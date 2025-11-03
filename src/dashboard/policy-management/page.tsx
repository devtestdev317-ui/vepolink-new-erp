
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, Download, FileText, Plus, Archive, Upload, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

// Types
interface PolicyDocument {
    id: string;
    title: string;
    category: 'hr' | 'travel' | 'code-of-conduct' | 'safety' | 'it';
    version: string;
    lastUpdated: Date;
    status: 'active' | 'draft' | 'archived';
    fileSize: string;
    downloadUrl: string;
    description: string;
    file?: File;
}

interface PolicyCategory {
    id: string;
    name: string;
    count: number;
    icon: React.ReactNode;
}

interface UploadPolicyForm {
    title: string;
    category: PolicyDocument['category'] | '';
    description: string;
    version: string;
    status: PolicyDocument['status'];
    file: File | null;
}

const PolicyManagementPage: React.FC = () => {
    const [documents, setDocuments] = useState<PolicyDocument[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState<UploadPolicyForm>({
        title: '',
        category: '',
        description: '',
        version: '1.0',
        status: 'draft',
        file: null,
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Mock data - in a real app, this would come from an API
    useEffect(() => {
        const mockDocuments: PolicyDocument[] = [
            {
                id: '1',
                title: 'Employee Leave Policy',
                category: 'hr',
                version: '2.1',
                lastUpdated: new Date('2024-01-15'),
                status: 'active',
                fileSize: '2.4 MB',
                downloadUrl: '#',
                description: 'Guidelines for employee leave, vacation, and time-off requests'
            },
            {
                id: '2',
                title: 'Travel and Expense Policy',
                category: 'travel',
                version: '1.5',
                lastUpdated: new Date('2024-01-10'),
                status: 'active',
                fileSize: '1.8 MB',
                downloadUrl: '#',
                description: 'Company policies for business travel and expense reimbursements'
            },
            {
                id: '3',
                title: 'Code of Conduct',
                category: 'code-of-conduct',
                version: '3.0',
                lastUpdated: new Date('2024-01-01'),
                status: 'active',
                fileSize: '1.2 MB',
                downloadUrl: '#',
                description: 'Employee behavior expectations and professional conduct guidelines'
            },
            {
                id: '4',
                title: 'IT Security Policy - Draft',
                category: 'it',
                version: '0.9',
                lastUpdated: new Date('2024-01-20'),
                status: 'draft',
                fileSize: '3.1 MB',
                downloadUrl: '#',
                description: 'Information technology security protocols and best practices'
            }
        ];

        setDocuments(mockDocuments);
        setLoading(false);
    }, []);

    const categories: PolicyCategory[] = [
        { id: 'all', name: 'All Policies', count: documents.length, icon: <FileText className="h-4 w-4" /> },
        { id: 'hr', name: 'HR Policies', count: documents.filter(d => d.category === 'hr').length, icon: <FileText className="h-4 w-4" /> },
        { id: 'travel', name: 'Travel', count: documents.filter(d => d.category === 'travel').length, icon: <FileText className="h-4 w-4" /> },
        { id: 'code-of-conduct', name: 'Code of Conduct', count: documents.filter(d => d.category === 'code-of-conduct').length, icon: <FileText className="h-4 w-4" /> },
        { id: 'it', name: 'IT Policies', count: documents.filter(d => d.category === 'it').length, icon: <FileText className="h-4 w-4" /> },
    ];

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['.pdf', '.doc', '.docx'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

            if (!allowedTypes.includes(fileExtension || '')) {
                toast.error("Invalid document", {
                    description: "Please select a valid document file (PDF, DOC, DOCX)",
                    action: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                })
                return;
            }

            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size exceeds limit", {
                    description: "File size must be less than 10MB",
                    action: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                })
                return;
            }

            setUploadForm(prev => ({
                ...prev,
                file,
            }));
        }
    };

    const removeSelectedFile = () => {
        setUploadForm(prev => ({
            ...prev,
            file: null,
        }));
    };

    const handleInputChange = (field: keyof UploadPolicyForm, value: string) => {
        setUploadForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const simulateUpload = async (): Promise<void> => {
        return new Promise((resolve) => {
            setUploadProgress(0);
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        resolve();
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadForm.file || !uploadForm.title || !uploadForm.category) {
            toast.error("Upload Failed", {
                description: "Please fill in all required fields and select a file",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
            return;
        }

        setIsUploading(true);

        try {
            // Simulate upload progress
            await simulateUpload();

            // Create new policy document
            const newDocument: PolicyDocument = {
                id: Math.random().toString(36).substr(2, 9),
                title: uploadForm.title,
                category: uploadForm.category as PolicyDocument['category'],
                version: uploadForm.version,
                lastUpdated: new Date(),
                status: uploadForm.status,
                fileSize: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
                downloadUrl: '#',
                description: uploadForm.description,
                file: uploadForm.file,
            };

            // Add to documents list
            setDocuments(prev => [newDocument, ...prev]);

            // Reset form and close dialog
            setUploadForm({
                title: '',
                category: '',
                description: '',
                version: '1.0',
                status: 'draft',
                file: null,
            });
            setUploadDialogOpen(false);

            toast.success("Upload Successful", {
                description: "Policy uploaded successfully",
                action: {
                    label: "Success",
                    onClick: () => console.log("Success"),
                },
            })

        } catch (error) {
            console.error('Upload failed:', error);
            toast.error("Upload Failed", {
                description: "Upload failed. Please try again",
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setUploadForm({
            title: '',
            category: '',
            description: '',
            version: '1.0',
            status: 'draft',
            file: null,
        });
        setUploadProgress(0);
    };

    const getStatusBadge = (status: PolicyDocument['status']) => {
        const statusConfig = {
            active: { variant: 'default' as const, label: 'Active' },
            draft: { variant: 'secondary' as const, label: 'Draft' },
            archived: { variant: 'outline' as const, label: 'Archived' }
        };

        const config = statusConfig[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getCategoryColor = (category: PolicyDocument['category']) => {
        const colors = {
            hr: 'bg-blue-100 text-blue-800',
            travel: 'bg-green-100 text-green-800',
            'code-of-conduct': 'bg-purple-100 text-purple-800',
            safety: 'bg-orange-100 text-orange-800',
            it: 'bg-red-100 text-red-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };


    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading policies...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Policy & Document Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Access and manage all company policies and documents in one place
                    </p>
                </div>

                {/* Upload Policy Dialog */}
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Upload New Policy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Upload New Policy</DialogTitle>
                            <DialogDescription>
                                Add a new policy document to the system. Fill in all required information and upload the document file.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Policy Title */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title">Policy Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter policy title"
                                        value={uploadForm.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={uploadForm.category}
                                        onValueChange={(value) => handleInputChange('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hr">HR Policies</SelectItem>
                                            <SelectItem value="travel">Travel</SelectItem>
                                            <SelectItem value="code-of-conduct">Code of Conduct</SelectItem>
                                            <SelectItem value="safety">Safety</SelectItem>
                                            <SelectItem value="it">IT Policies</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Version */}
                                <div className="space-y-2">
                                    <Label htmlFor="version">Version</Label>
                                    <Input
                                        id="version"
                                        placeholder="1.0"
                                        value={uploadForm.version}
                                        onChange={(e) => handleInputChange('version', e.target.value)}
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={uploadForm.status}
                                        onValueChange={(value) => handleInputChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter policy description"
                                        value={uploadForm.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                {/* File Upload */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="file">Document File *</Label>
                                    {!uploadForm.file ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Input
                                                id="file"
                                                type="file"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <Label htmlFor="file" className="cursor-pointer">
                                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                <p className="font-medium">Click to upload document</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Supports PDF, DOC, DOCX, TXT (Max 10MB)
                                                </p>
                                            </Label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-6 w-6 text-blue-500" />
                                                <div>
                                                    <p className="font-medium">{uploadForm.file.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={removeSelectedFile}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="md:col-span-2 space-y-2">
                                        <Label>Upload Progress</Label>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">{uploadProgress}%</p>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setUploadDialogOpen(false);
                                        resetForm();
                                    }}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUploading}>
                                    {isUploading ? 'Uploading...' : 'Upload Policy'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>


            </div>

            {/* Rest of the component remains the same */}
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search policies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Categories */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${selectedCategory === category.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {category.icon}
                                        <span>{category.name}</span>
                                    </div>
                                    <Badge variant={selectedCategory === category.id ? "secondary" : "outline"}>
                                        {category.count}
                                    </Badge>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Document List */}
                <div className="lg:col-span-3">
                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="all">All Documents</TabsTrigger>
                            <TabsTrigger value="recent">Recently Updated</TabsTrigger>
                            <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {filteredDocuments.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-lg font-medium mb-2">No policies found</p>
                                        <p className="text-muted-foreground text-center">
                                            No policies match your search criteria. Try adjusting your filters.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredDocuments.map((document) => (
                                    <Card key={document.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{document.title}</h3>
                                                            <p className="text-muted-foreground mt-1">
                                                                {document.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(document.status)}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                        <Badge variant="outline" className={getCategoryColor(document.category)}>
                                                            {document.category.toUpperCase()}
                                                        </Badge>
                                                        <span>Version {document.version}</span>
                                                        <span>Updated {document.lastUpdated.toLocaleDateString()}</span>
                                                        <span>{document.fileSize}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link to={document.downloadUrl === "#" ? "/assets/doc/SPM Brochure.pdf" : document.downloadUrl} download={document.downloadUrl === "#" ? "/assets/doc/SPM Brochure.pdf" : document.downloadUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                            <Download className="h-4 w-4" />
                                                            Download
                                                        </Button>
                                                    </Link>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                •••
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem>
                                                                <Archive className="h-4 w-4 mr-2" />
                                                                Archive
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default PolicyManagementPage;