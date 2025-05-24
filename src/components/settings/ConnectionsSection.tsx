
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Twitter, Globe } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useSocialConnections } from '@/hooks/useSocialConnections';

const ConnectionsSection = () => {
  const { connections, addConnection, removeConnection, getConnectionByPlatform } = useSocialConnections();

  const [connectionUrls, setConnectionUrls] = useState({
    github: '',
    twitter: '',
    website: '',
  });

  useEffect(() => {
    connections.forEach(conn => {
      setConnectionUrls(prev => ({
        ...prev,
        [conn.platform]: conn.url
      }));
    });
  }, [connections]);

  const handleConnectionAdd = async (platform: 'github' | 'twitter' | 'website') => {
    const url = connectionUrls[platform];
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addConnection(platform, url);
      toast({
        title: "Connection added",
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} connection has been added.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: "Error",
        description: "Failed to add connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConnectionRemove = async (platform: string) => {
    try {
      await removeConnection(platform);
      setConnectionUrls(prev => ({ ...prev, [platform]: '' }));
      toast({
        title: "Connection removed",
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} connection has been removed.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast({
        title: "Error",
        description: "Failed to remove connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Connected Accounts</CardTitle>
        <CardDescription className="text-slate-400">
          Link your accounts from other platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* GitHub Connection */}
          <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
            <div className="flex items-center">
              <div className="bg-slate-700 p-2 rounded-md mr-4">
                <Github className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">GitHub</h4>
                <p className="text-sm text-slate-400">Connect your GitHub account</p>
                {getConnectionByPlatform('github') && (
                  <p className="text-xs text-cyan-400">{getConnectionByPlatform('github')?.url}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!getConnectionByPlatform('github') ? (
                <>
                  <Input
                    placeholder="https://github.com/username"
                    value={connectionUrls.github}
                    onChange={(e) => setConnectionUrls({...connectionUrls, github: e.target.value})}
                    className="w-64 bg-slate-700 border-slate-600 text-slate-200"
                  />
                  <Button 
                    variant="outline" 
                    className="border-cyan-500 text-cyan-400"
                    onClick={() => handleConnectionAdd('github')}
                  >
                    Connect
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400"
                  onClick={() => handleConnectionRemove('github')}
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
          
          {/* Twitter Connection */}
          <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
            <div className="flex items-center">
              <div className="bg-slate-700 p-2 rounded-md mr-4">
                <Twitter className="h-6 w-6 text-sky-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">Twitter</h4>
                <p className="text-sm text-slate-400">Connect your Twitter account</p>
                {getConnectionByPlatform('twitter') && (
                  <p className="text-xs text-cyan-400">{getConnectionByPlatform('twitter')?.url}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!getConnectionByPlatform('twitter') ? (
                <>
                  <Input
                    placeholder="https://twitter.com/username"
                    value={connectionUrls.twitter}
                    onChange={(e) => setConnectionUrls({...connectionUrls, twitter: e.target.value})}
                    className="w-64 bg-slate-700 border-slate-600 text-slate-200"
                  />
                  <Button 
                    variant="outline" 
                    className="border-cyan-500 text-cyan-400"
                    onClick={() => handleConnectionAdd('twitter')}
                  >
                    Connect
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400"
                  onClick={() => handleConnectionRemove('twitter')}
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
          
          {/* Website Connection */}
          <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
            <div className="flex items-center">
              <div className="bg-slate-700 p-2 rounded-md mr-4">
                <Globe className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">Website</h4>
                <p className="text-sm text-slate-400">Link your personal website</p>
                {getConnectionByPlatform('website') && (
                  <p className="text-xs text-cyan-400">{getConnectionByPlatform('website')?.url}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!getConnectionByPlatform('website') ? (
                <>
                  <Input
                    placeholder="https://yourwebsite.com"
                    value={connectionUrls.website}
                    onChange={(e) => setConnectionUrls({...connectionUrls, website: e.target.value})}
                    className="w-64 bg-slate-700 border-slate-600 text-slate-200"
                  />
                  <Button 
                    variant="outline" 
                    className="border-cyan-500 text-cyan-400"
                    onClick={() => handleConnectionAdd('website')}
                  >
                    Add
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400"
                  onClick={() => handleConnectionRemove('website')}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionsSection;
