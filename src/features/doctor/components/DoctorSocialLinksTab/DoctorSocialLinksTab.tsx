import React, { useState, useCallback } from 'react';
import {
  Check,
  CheckCircle2,
  Plus,
  Trash2,
  ExternalLink,
  Share2,
  AlertCircle,
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

const AVAILABLE_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', defaultPlaceholder: 'https://instagram.com/your-sanctuary' },
  { id: 'linkedin', label: 'LinkedIn', defaultPlaceholder: 'https://linkedin.com/company/your-sanctuary' },
  { id: 'facebook', label: 'Facebook', defaultPlaceholder: 'https://facebook.com/your-sanctuary' },
  { id: 'youtube', label: 'YouTube', defaultPlaceholder: 'https://youtube.com/@your-sanctuary' },
  { id: 'twitter', label: 'X (Twitter)', defaultPlaceholder: 'https://x.com/your-sanctuary' },
  { id: 'github', label: 'GitHub', defaultPlaceholder: 'https://github.com/your-org' },
  { id: 'whatsapp', label: 'WhatsApp', defaultPlaceholder: 'https://wa.me/917356702775' },
  { id: 'website', label: 'Custom Website', defaultPlaceholder: 'https://yourwebsite.com' },
];

export const DoctorSocialLinksTab: React.FC<Props> = React.memo(
  ({ links, onSave, isSaving, saved }) => {
    const [localLinks, setLocalLinks] = useState<SocialLink[]>(links);
    const [newPlatform, setNewPlatform] = useState('instagram');
    const [newUrl, setNewUrl] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    // Keep localLinks in sync when external links change (e.g., initial load)
    React.useEffect(() => {
      setLocalLinks(links);
    }, [links]);

    const handleAddLink = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newUrl.trim();
        if (!trimmed) {
          setValidationError('Please enter a valid URL.');
          return;
        }

        // Basic URL validation
        if (!/^https?:\/\//i.test(trimmed)) {
          setValidationError('URL must start with http:// or https://');
          return;
        }

        const newLink: SocialLink = {
          id: `temp-${Date.now()}`,
          platform: newPlatform,
          url: trimmed,
        };

        setLocalLinks((prev) => [...prev, newLink]);
        setNewUrl('');
        setValidationError(null);
      },
      [newPlatform, newUrl]
    );

    const handleUpdateUrl = useCallback((index: number, updatedUrl: string) => {
      setLocalLinks((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], url: updatedUrl };
        return next;
      });
    }, []);

    const handleRemoveLink = useCallback((index: number) => {
      setLocalLinks((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmitAll = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onSave(localLinks);
      },
      [localLinks, onSave]
    );

    const currentPlatformConfig =
      AVAILABLE_PLATFORMS.find((p) => p.id === newPlatform) || AVAILABLE_PLATFORMS[0];

    return (
      <div className="settings-tab-pane social-links-pane">
        {/* Section Header */}
        <div className="settings-pane-header">
          <div className="pane-header-titles">
            <h2 className="pane-title">Social Links &amp; Channels</h2>
            <p className="pane-subtitle">
              Manage dynamic social channels displayed across customer sanctuary footers and contact pages.
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
                onClick={handleSubmitAll}
                className="btn-primary-action"
              >
                <Check size={14} />
                <span>{isSaving ? 'Saving Changes...' : 'Save Social Links'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="settings-divider-rule" />

        {/* Add New Link Card */}
        <div className="social-add-card">
          <div className="social-add-card-header">
            <div className="social-add-title-wrap">
              <Share2 size={16} className="social-accent-icon" />
              <span className="social-add-title">Add New Social Channel</span>
            </div>
            <span className="social-add-hint">
              Channels update immediately on the patient website upon saving.
            </span>
          </div>

          <form onSubmit={handleAddLink} className="social-add-form">
            <div className="social-platform-select-wrap">
              <label htmlFor="platform-select" className="visually-hidden">
                Select Platform
              </label>
              <select
                id="platform-select"
                className="social-platform-select"
                value={newPlatform}
                onChange={(e) => {
                  setNewPlatform(e.target.value);
                  setValidationError(null);
                }}
              >
                {AVAILABLE_PLATFORMS.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="social-url-input-wrap">
              <label htmlFor="url-input" className="visually-hidden">
                Platform URL
              </label>
              <input
                id="url-input"
                type="url"
                className={`social-url-input ${validationError ? 'has-error' : ''}`}
                placeholder={currentPlatformConfig.defaultPlaceholder}
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value);
                  if (validationError) setValidationError(null);
                }}
              />
            </div>

            <button type="submit" className="social-add-btn">
              <Plus size={15} />
              <span>Add Link</span>
            </button>
          </form>

          {validationError && (
            <div className="social-validation-msg">
              <AlertCircle size={14} />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Dynamic Social Links Table / List */}
        <div className="social-table-section">
          <div className="social-table-bar">
            <span className="social-table-count">
              Configured Channels ({localLinks.length})
            </span>
            <span className="social-table-info">
              Click URL to edit directly, or test live via the preview button.
            </span>
          </div>

          {localLinks.length === 0 ? (
            <div className="social-empty-view">
              <Share2 size={32} className="social-empty-icon" />
              <p className="social-empty-title">No Social Channels Added Yet</p>
              <p className="social-empty-desc">
                Add platforms like Instagram, LinkedIn, YouTube, or GitHub using the form above.
              </p>
            </div>
          ) : (
            <div className="social-table-list">
              {localLinks.map((link, idx) => (
                <div key={link.id || idx} className="social-row-card">
                  {/* Platform Indicator */}
                  <div className="social-row-platform">
                    <span className="social-row-icon-pill">
                      <SocialPlatformIcon platform={link.platform} size={16} />
                    </span>
                    <span className="social-row-name">
                      {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    </span>
                  </div>

                  {/* Editable URL Input Field */}
                  <div className="social-row-input-field">
                    <input
                      type="url"
                      className="social-row-text"
                      value={link.url}
                      onChange={(e) => handleUpdateUrl(idx, e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  {/* Actions: Open link in new tab + Delete button */}
                  <div className="social-row-actions">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-action-btn"
                      title="Open link in new tab to test"
                      aria-label={`Open ${link.platform} link`}
                    >
                      <ExternalLink size={15} />
                    </a>

                    <button
                      type="button"
                      className="social-action-btn social-delete-btn"
                      onClick={() => handleRemoveLink(idx)}
                      title="Remove channel"
                      aria-label={`Remove ${link.platform} channel`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

DoctorSocialLinksTab.displayName = 'DoctorSocialLinksTab';
