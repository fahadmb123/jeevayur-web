import React, { useState, useEffect, useCallback } from 'react';
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
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

interface PlatformState {
  id?: string;
  url: string;
  isVisible: boolean;
}

export const DoctorSocialLinksTab: React.FC<Props> = React.memo(
  ({ links, onSave, isSaving, saved }) => {
    // Map existing links by platform for fast lookup
    const buildPlatformMap = useCallback((items: SocialLink[]) => {
      const map: Record<string, PlatformState> = {};
      items.forEach((item) => {
        if (item.platform) {
          const key = item.platform.toLowerCase().trim();
          map[key] = {
            id: item.id,
            url: item.url || '',
            isVisible: item.isVisible !== false,
          };
        }
      });
      return map;
    }, []);

    // State holds URLs and visibility for each platform
    const [platformValues, setPlatformValues] = useState<Record<string, PlatformState>>(() =>
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
          isVisible: prev[platformId]?.isVisible ?? true,
        },
      }));
    };

    const handleToggleVisibility = (platformId: string) => {
      setPlatformValues((prev) => {
        const current = prev[platformId];
        const nextVisible = current ? !current.isVisible : false;
        return {
          ...prev,
          [platformId]: {
            id: current?.id,
            url: current?.url || '',
            isVisible: nextVisible,
          },
        };
      });
    };

    const handleSave = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        // Convert platformValues into an array of SocialLink items
        // Include platforms with non-empty URLs
        const payload: SocialLink[] = Object.entries(platformValues)
          .filter(([_, val]) => val.url && val.url.trim().length > 0)
          .map(([platform, val]) => ({
            id: val.id || '',
            platform,
            url: val.url.trim(),
            isVisible: val.isVisible,
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
              Configure URLs and toggle visibility for channels displayed on the customer website and footer.
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
              Use the Visible/Hidden button on each channel to control its appearance on the customer website.
            </span>
          </div>

          <form onSubmit={handleSave} className="social-table-list">
            {SUPPORTED_PLATFORMS.map((platform) => {
              const currentVal = platformValues[platform.id]?.url || '';
              const isVisible = platformValues[platform.id]?.isVisible ?? true;
              const hasUrl = currentVal.trim().length > 0;

              return (
                <div
                  key={platform.id}
                  className={`social-row-card ${!isVisible ? 'is-channel-hidden' : ''}`}
                >
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

                  {/* Visibility Toggle Button & Test Link */}
                  <div className="social-row-actions">
                    {/* Visibility Toggle Button */}
                    <button
                      type="button"
                      className={`social-visibility-toggle ${isVisible ? 'is-visible' : 'is-hidden'}`}
                      onClick={() => handleToggleVisibility(platform.id)}
                      title={isVisible ? 'Visible on website (Click to hide)' : 'Hidden from website (Click to show)'}
                      aria-label={`Toggle visibility for ${platform.label}`}
                    >
                      {isVisible ? (
                        <>
                          <Eye size={14} />
                          <span className="visibility-toggle-text">Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          <span className="visibility-toggle-text">Hidden</span>
                        </>
                      )}
                    </button>

                    {/* Action: Open link in new tab to test (if URL entered) */}
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
