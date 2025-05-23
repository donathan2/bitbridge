
/**
 * Get the appropriate color for task status
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-amber-500';
    case 'pending': return 'bg-slate-500';
    default: return 'bg-slate-500';
  }
};

/**
 * Get the appropriate icon for a file type
 */
export const getFileIcon = (type: string) => {
  const { FileText, Code } = require("lucide-react");
  
  switch (type) {
    case 'figma': return <Code className="h-5 w-5" />;
    case 'pdf': return <FileText className="h-5 w-5" />;
    case 'markdown': case 'document': return <FileText className="h-5 w-5" />;
    case 'archive': return <FileText className="h-5 w-5" />;
    default: return <FileText className="h-5 w-5" />;
  }
};
