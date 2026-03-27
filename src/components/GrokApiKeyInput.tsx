import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Key, CheckCircle, AlertCircle } from "lucide-react";
import { setGrokApiKey, getGrokApiKey, clearGrokApiKey } from "@/lib/grok";

interface GrokApiKeyInputProps {
  onApiKeySet?: (hasKey: boolean) => void;
}

export const GrokApiKeyInput = ({ onApiKeySet }: GrokApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSet, setIsSet] = useState(!!getGrokApiKey());
  const [message, setMessage] = useState("");

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setMessage("Please enter a valid API key");
      return;
    }

    try {
      setGrokApiKey(apiKey.trim());
      setIsSet(true);
      setMessage("✅ Grok API key saved successfully!");
      setApiKey("");
      onApiKeySet?.(true);
    } catch (error) {
      setMessage("❌ Failed to save API key");
    }
  };

  const handleClearKey = () => {
    clearGrokApiKey();
    setIsSet(false);
    setMessage("🗑️ API key cleared");
    onApiKeySet?.(false);
  };

  const handleTestKey = async () => {
    if (!isSet) {
      setMessage("Please set an API key first");
      return;
    }

    setMessage("🔄 Testing API key...");
    
    // Simple test - we'll just check if the key format looks valid
    const savedKey = getGrokApiKey();
    if (savedKey && savedKey.startsWith('xai-')) {
      setMessage("✅ API key format looks valid!");
    } else {
      setMessage("⚠️ API key format may be incorrect. Grok keys typically start with 'xai-'");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          Grok AI Configuration
        </CardTitle>
        <CardDescription>
          Enter your Grok AI API key for enhanced resume analysis. Get your key from{" "}
          <a 
            href="https://console.x.ai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            X.AI Console
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSet ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grok-api-key">Grok API Key</Label>
              <div className="relative">
                <Input
                  id="grok-api-key"
                  type={showKey ? "text" : "password"}
                  placeholder="xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button onClick={handleSaveKey} className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Save API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Grok AI API key is configured</span>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleTestKey} variant="outline" className="flex-1">
                Test Connection
              </Button>
              <Button onClick={handleClearKey} variant="destructive" className="flex-1">
                Clear Key
              </Button>
            </div>
          </div>
        )}
        
        {message && (
          <div className={`p-3 rounded-lg border ${
            message.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.includes('❌') || message.includes('⚠️')
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('✅') && <CheckCircle className="h-4 w-4" />}
              {(message.includes('❌') || message.includes('⚠️')) && <AlertCircle className="h-4 w-4" />}
              <span className="text-sm">{message}</span>
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>🔒 Your API key is stored locally in your browser and never sent to our servers.</p>
          <p>🤖 Grok AI provides more detailed and accurate resume analysis compared to basic analysis.</p>
        </div>
      </CardContent>
    </Card>
  );
};
