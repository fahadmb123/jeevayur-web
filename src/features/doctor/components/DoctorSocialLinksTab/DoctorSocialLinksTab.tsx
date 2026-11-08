import React, { useState, useEffect, useCallback } from 'react';
import {
  Check,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/shared/ui/SocialPlatformIcon';
import type { SocialLink } from '@/shared/services/socialLinksService';
import './DoctorSocialLinksTab.css';

interface Props {
  links: SocialLink[];
  onSave: (links: SocialLink[]) => Promise<void>;
  isSaving: boolean;
  saved: boolean;
}

interface PlatformDefinition {
  id: string;
  label: string;
  placeholder: string;
}

const SUPPORTED_PLATFORMS: PlatformDefinition[] = [
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/your-sanctuary' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/your-sanctuary' },
  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/your-sanctuary' },
  { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@your-sanctuary' },
  { id: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/your-sanctuary' },
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/your-org' },
  { id: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/917356702775' },
];

export const DoctorSocialLinksTab: React.FC<Props> = React.memo(
  ({ links, onSave, isSaving, saved }) => {
    // Map existing links by platform for fast lookup
    const buildPlatformMap = useCallback((items: SocialLink[]) => {
      const map: Record<string, { id?: string; url: string }> = {};
      items.forEach((item) => {
        if (item.platform) {
          map[item.platform.toLowerCase().trim()] = {
            id: item.id,
            url: item.url || '',
          };
        }
      });
      return map;
    }, []);

    // State holds URLs for each platform
    const [platformValues, setPlatformValues] = useState<Record<string, { id?: string; url: string }>>(() =>
      buildPlatformMap(links)
    );

    // Sync when external links change (e.g. on initial fetch from API)
    useEffect(() => {
      setPlatformValues(buildPlatformMap(links));
    }, [links, buildPlatformMap]);

    const handleUrlChange = (platformId: string, url: string) => {
      setPlatformValues((prev) => ({
        ...prev,
        [platformId]: {
          id: prev[platformId]?.id,
          url,
        },
      }));
    };

    const handleSave = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        // Convert platformValues into an array of SocialLink items
        // Include all platforms that have a non-empty trimmed URL
        const payload: SocialLink[] = Object.entries(platformValues)
          .filter(([_, val]) => val.url && val.url.trim().length > 0)
          .map(([platform, val]) => ({
            id: val.id || '',
            platform,
            url: val.url.trim(),
          }));

        onSave(payload);
      },
      [platformValues, onSave]
    );

    return (
      <div className="settings-tab-pane social-links-pane">
        {/* Section Header */}
        <div className="settings-pane-header">
          <div className="pane-header-titles">
            <h2 className="pane-title">Social Links &amp; Channels</h2>
            <p className="pane-subtitle">
              Configure the social media links displayed across the customer sanctuary website and footer.
            </p>
          </div>

          <div className="pane-header-actions">
            {saved ? (
              <span className="saved-status-badge">
                <CheckCircle2 size={14} /> Saved to Sanctuary
              </span>
            ) : (
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="btn-primary-action"
              >
                <Check size={14} />
                <span>{isSaving ? 'Saving Changes...' : 'Save Social Links'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="settings-divider-rule" />

        {/* Channels Configuration Table */}
        <div className="social-table-section">
          <div className="social-table-bar">
            <span className="social-table-count">
              Sanctuary Channels ({SUPPORTED_PLATFORMS.length})
            </span>
            <span className="social-table-info">
              Enter your official URLs below and click &quot;Save Social Links&quot;. Active channels appear in the website footer.
            </span>
          </div>

          <form onSubmit={handleSave} className="social-table-list">
            {SUPPORTED_PLATFORMS.map((platform) => {
              const currentVal = platformValues[platform.id]?.url || '';
              const hasUrl = currentVal.trim().length > 0;

              return (
                <div key={platform.id} className="social-row-card">
                  {/* Platform Indicator */}
                  <div className="social-row-platform">
                    <span className="social-row-icon-pill">
                      <SocialPlatformIcon platform={platform.id} size={16} />
                    </span>
                    <span className="social-row-name">{platform.label}</span>
                  </div>

                  {/* Editable URL Input */}
                  <div className="social-row-input-field">
                    <input
                      type="url"
                      className="social-row-text"
                      value={currentVal}
                      onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                      placeholder={platform.placeholder}
                      aria-label={`${platform.label} URL`}
                    />
                  </div>

                  {/* Action: Open link in new tab to test (if URL entered) */}
                  <div className="social-row-actions">
                    {hasUrl ? (
                      <a
                        href={currentVal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-action-btn"
                        title={`Test ${platform.label} link in new tab`}
                        aria-label={`Open ${platform.label} in new tab`}
                      >
                        <ExternalLink size={15} />
                      </a>
                    ) : (
                      <span className="social-action-placeholder" title="Enter a URL to test" />
                    )}
                  </div>
                </div>
              );
            })}
          </form>
        </div>
      </div>
    );
  }
);

DoctorSocialLinksTab.displayName = 'DoctorSocialLinksTab';
