import React, { useState, useEffect, useCallback } from 'react';
import {
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/shared/ui/SocialPlatformIcon';
import type { SocialLink } from '@/shared/services/socialLinksService';
import './DoctorSocialLinksTab.css';

interface Props {
  links: SocialLink[];
  onSave: (links: SocialLink[]) => Promise<void>;
  isSaving: boolean;
  saved: boolean;
  errorMessage?: string | null;
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
];

interface PlatformState {
  id?: string;
  url: string;
  isVisible: boolean;
}

export const DoctorSocialLinksTab: React.FC<Props> = React.memo(
  ({ links, onSave, isSaving, saved, errorMessage }) => {
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
        // Include ALL supported platforms so their visibility and URL state are strictly preserved
        const payload: SocialLink[] = SUPPORTED_PLATFORMS.map((platform) => {
          const val = platformValues[platform.id];
          return {
            id: val?.id || '',
            platform: platform.id,
            url: (val?.url || '').trim(),
            isVisible: val?.isVisible ?? true,
          };
        });

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
            {errorMessage && (
              <span className="social-error-badge">
                <AlertCircle size={14} /> {errorMessage}
              </span>
            )}
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
                {isSaving ? <Loader2 size={14} className="social-spin-icon" /> : <Check size={14} />}
                <span>{isSaving ? 'Saving Changes...' : 'Save Social Links'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="settings-divider-rule" />

        {/* Clean row-by-row layout matching Sanctuary Settings standard */}
        <form onSubmit={handleSave} className="settings-fields-stack">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const currentVal = platformValues[platform.id]?.url || '';
            const isVisible = platformValues[platform.id]?.isVisible ?? true;

            return (
              <div
                key={platform.id}
                className={`settings-field-row social-field-row ${!isVisible ? 'is-channel-hidden' : ''}`}
              >
                {/* Platform Label with Icon & Name */}
                <div className="field-label-cell">
                  <div className="social-platform-label">
                    <span className="social-platform-icon-pill">
                      <SocialPlatformIcon platform={platform.id} size={17} />
                    </span>
                    <span className="social-platform-name">{platform.label}</span>
                  </div>
                </div>

                {/* URL Input & Visibility Toggle */}
                <div className="field-control-cell social-field-control">
                  <div className="social-input-row">
                    <div className="modern-input-group social-url-input-group">
                      <input
                        type="url"
                        className="input-group-text"
                        value={currentVal}
                        onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                        placeholder={platform.placeholder}
                        aria-label={`${platform.label} URL`}
                      />
                    </div>

                    <button
                      type="button"
                      className={`social-visibility-toggle ${isVisible ? 'is-visible' : 'is-hidden'}`}
                      onClick={() => handleToggleVisibility(platform.id)}
                      title={
                        isVisible
                          ? 'Visible on customer website (Click to hide)'
                          : 'Hidden from customer website (Click to show)'
                      }
                      aria-label={`Toggle visibility for ${platform.label}`}
                    >
                      {isVisible ? (
                        <>
                          <Eye size={14} className="visibility-toggle-icon" />
                          <span className="visibility-toggle-text">Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} className="visibility-toggle-icon" />
                          <span className="visibility-toggle-text">Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </form>
      </div>
    );
  }
);

DoctorSocialLinksTab.displayName = 'DoctorSocialLinksTab';
