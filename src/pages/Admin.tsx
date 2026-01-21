import { useState } from 'react';
import { 
  RefreshIcon, 
  CheckIcon, 
  AlertIcon, 
  ClockIcon,
  UploadIcon,
  InfoIcon,
  ListIcon,
  GridIcon,
} from '@/components/icons';
import { adminStats, mockJobs } from '@/data/mockVideos';
import type { Job } from '@/types';
import { getStatusColor } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function Admin() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleRetry = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'pending', attempts: 0, progress: 0 }
        : job
    ));
  };

  const handleCancel = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <div className="w-4 h-4 border-2 border-vp-blue border-t-transparent rounded-full animate-spin" />;
      case 'pending':
        return <ClockIcon size={16} className="text-vp-orange" />;
      case 'completed':
        return <CheckIcon size={16} className="text-vp-green" />;
      case 'failed':
        return <AlertIcon size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-vp-blue/10 text-vp-blue';
      case 'pending': return 'bg-vp-orange/10 text-vp-orange';
      case 'completed': return 'bg-vp-green/10 text-vp-green';
      case 'failed': return 'bg-red-500/10 text-red-500';
      default: return 'bg-vp-surface text-vp-text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-vp-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-vp-black/90 backdrop-blur-xl border-b border-vp-surface-light">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-vp-text">Admin Dashboard</h1>
              <p className="text-sm text-vp-text-secondary mt-0.5">
                Queue monitor & content management
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-vp-surface-light text-vp-text hover:bg-vp-surface"
              >
                <RefreshIcon size={16} className="mr-2" />
                Refresh
              </Button>
              
              <Button
                size="sm"
                className="bg-vp-red hover:bg-vp-red-dark text-white"
              >
                <UploadIcon size={16} className="mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64 lg:border-r border-vp-surface-light lg:min-h-screen">
          {/* Stats Cards */}
          <div className="p-4 space-y-3">
            <h2 className="text-sm font-medium text-vp-text mb-3">Overview</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="p-4 rounded-xl bg-vp-surface">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vp-orange/10 flex items-center justify-center">
                    <ClockIcon size={20} className="text-vp-orange" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-vp-text">{adminStats.pending}</p>
                    <p className="text-xs text-vp-text-secondary">Pending</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-vp-surface">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vp-blue/10 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-vp-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-vp-text">{adminStats.processing}</p>
                    <p className="text-xs text-vp-text-secondary">Processing</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-vp-surface">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertIcon size={20} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-vp-text">{adminStats.failed}</p>
                    <p className="text-xs text-vp-text-secondary">Failed</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-vp-surface">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vp-green/10 flex items-center justify-center">
                    <CheckIcon size={20} className="text-vp-green" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-vp-text">{adminStats.completed}</p>
                    <p className="text-xs text-vp-text-secondary">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-vp-surface-light">
              <h3 className="text-sm font-medium text-vp-text mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-sm text-left text-vp-text-secondary hover:text-vp-text hover:bg-vp-surface rounded-lg transition-colors">
                  Bulk Upload
                </button>
                <button className="w-full px-3 py-2 text-sm text-left text-vp-text-secondary hover:text-vp-text hover:bg-vp-surface rounded-lg transition-colors">
                  Queue Settings
                </button>
                <button className="w-full px-3 py-2 text-sm text-left text-vp-text-secondary hover:text-vp-text hover:bg-vp-surface rounded-lg transition-colors">
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Job Queue Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-vp-text">Job Queue</h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-vp-surface text-vp-text' 
                    : 'text-vp-text-muted hover:bg-vp-surface'
                }`}
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-vp-surface text-vp-text' 
                    : 'text-vp-text-muted hover:bg-vp-surface'
                }`}
              >
                <GridIcon size={18} />
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className={viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-vp-surface hover:bg-vp-surface-light transition-colors"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="text-sm font-medium text-vp-text">Video {job.videoId}</p>
                      <p className="text-xs text-vp-text-muted">
                        Job ID: {job.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  
                  <span
                    className={`
                      px-2 py-0.5 rounded-full text-[10px] font-medium
                      ${getStatusColorClass(job.status)}
                    `}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Progress Bar */}
                {(job.status === 'processing' || job.status === 'pending') && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-vp-text-secondary">Progress</span>
                      <span className="text-xs text-vp-text-muted">{Math.round(job.progress)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-1.5" />
                  </div>
                )}

                {/* Error Message */}
                {job.error && (
                  <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400">{job.error}</p>
                  </div>
                )}

                {/* Job Info */}
                <div className="flex items-center justify-between text-xs text-vp-text-muted mb-3">
                  <span>Attempts: {job.attempts}/{job.maxAttempts}</span>
                  {job.startedAt && (
                    <span>Started: {new Date(job.startedAt).toLocaleTimeString()}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {job.status === 'failed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetry(job.id)}
                      className="flex-1 border-vp-surface-light text-vp-text hover:bg-vp-surface text-xs"
                    >
                      Retry
                    </Button>
                  )}
                  
                  {(job.status === 'pending' || job.status === 'processing') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(job.id)}
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                    >
                      Cancel
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedJob(job)}
                        className="border-vp-surface-light text-vp-text-muted hover:text-vp-text hover:bg-vp-surface px-2"
                      >
                        <InfoIcon size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-vp-surface border-vp-surface-light">
                      <DialogHeader>
                        <DialogTitle className="text-vp-text">Job Details</DialogTitle>
                      </DialogHeader>
                      {selectedJob && (
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-vp-text-secondary">Job ID:</span>
                            <span className="text-vp-text font-mono">{selectedJob.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-vp-text-secondary">Video ID:</span>
                            <span className="text-vp-text">{selectedJob.videoId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-vp-text-secondary">Status:</span>
                            <span className={`capitalize ${getStatusColor(selectedJob.status)}`}>
                              {selectedJob.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-vp-text-secondary">Progress:</span>
                            <span className="text-vp-text">{Math.round(selectedJob.progress)}%</span>
                          </div>
                          {selectedJob.error && (
                            <div>
                              <span className="text-vp-text-secondary">Error:</span>
                              <p className="text-red-400 mt-1">{selectedJob.error}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
