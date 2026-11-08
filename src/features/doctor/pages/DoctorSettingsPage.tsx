import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  Search,
  Info,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AUTH_QUERY_KEY } from '@/features/auth/hooks/useAuthMutation';
import { authService } from '@/features/auth/services/authService';
import { DoctorSessionsCard } from '../components/DoctorSessionsCard/index';
import { DoctorSocialLinksTab } from '../components/DoctorSocialLinksTab/index';
import { socialLinksService, type SocialLink } from '@/shared/services/socialLinksService';
import './DoctorSettingsPage.css';

type SettingsTab = 'profile' | 'social' | 'devices';

interface TabItem {
  id: SettingsTab;
  label: string;
}

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const DoctorSettingsPage: React.FC = React.memo(() => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [savedSocial, setSavedSocial] = useState(false);
  const [socialSaveError, setSocialSaveError] = useState<string | null>(null);

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
    },
  });

  useEffect(() => {
    if (user?.name) {
      reset({ name: user.name });
    }
  }, [user?.name, reset]);

  useEffect(() => {
    let isMounted = true;
    socialLinksService
      .getSocialLinks(true)
      .then((links) => {
        if (isMounted && Array.isArray(links)) {
          setSocialLinks(links);
        }
      })
      .catch((err) => {
        console.warn('Failed to load social links in settings:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSocialLinks = useCallback(async (updatedLinks: SocialLink[]) => {
    setIsSavingSocial(true);
    setSocialSaveError(null);
    try {
      const saved = await socialLinksService.bulkSaveSocialLinks(updatedLinks);
      setSocialLinks(saved);
      setSavedSocial(true);
      setTimeout(() => setSavedSocial(false), 2500);
    } catch (err: unknown) {
      console.error('Failed to save social links:', err);
      const message = err instanceof Error ? err.message : 'Failed to save social links';
      setSocialSaveError(message);
    } finally {
      setIsSavingSocial(false);
    }
  }, []);

  const handleSaveGeneral = useCallback(
    async (values: ProfileFormValues) => {
      setGeneralError(null);
      try {
        const updatedUser = await authService.updateProfile({
          name: values.name.trim(),
        });

        queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
        reset({ name: updatedUser.name });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err: unknown) {
        console.error('Failed to update profile:', err);
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        setGeneralError(message);
      }
    },
    [queryClient, reset]
  );

  const tabs: TabItem[] = useMemo(
    () => [
      { id: 'profile', label: 'General' },
      { id: 'social', label: 'Social Links' },
      { id: 'devices', label: 'Account & Devices' },
    ],
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    const lower = q.toLowerCase();
    if (lower.includes('device') || lower.includes('session') || lower.includes('logout') || lower.includes('security') || lower.includes('account')) {
      setActiveTab('devices');
    } else if (lower.includes('social') || lower.includes('instagram') || lower.includes('linkedin') || lower.includes('twitter') || lower.includes('facebook') || lower.includes('youtube') || lower.includes('link')) {
      setActiveTab('social');
    } else if (lower.includes('profile') || lower.includes('user') || lower.includes('name')) {
      setActiveTab('profile');
    }
  };

  return (
    <div className="doctor-page-content doctor-settings-container">
      <div className="settings-canvas-card">
        <div className="settings-card-topbar">
          <h1 className="settings-page-title">Settings</h1>
          <div className="settings-search-pill">
            <input
              type="text"
              className="settings-search-field"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search size={16} className="settings-search-icon" />
          </div>
        </div>

        <nav className="settings-subnavbar" aria-label="Settings sub-navigation">
          <div className="settings-tabs-row">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`settings-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-text">{tab.label}</span>
                  {isActive && <div className="tab-indicator-bar" />}
                </button>
              );
            })}
          </div>
        </nav>

        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit(handleSaveGeneral)} className="settings-tab-pane" noValidate>
            <div className="settings-pane-header">
              <div className="pane-header-titles">
                <h2 className="pane-title">Your Profile</h2>
                <p className="pane-subtitle">Please update your profile settings here</p>
              </div>

              <div className="pane-header-actions">
                <div
                  className="tooltip-container"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <button
                    type="button"
                    className="tooltip-trigger-btn"
                    onClick={() => setShowTooltip((prev) => !prev)}
                    aria-label="Profile information"
                  >
                    <Info size={16} />
                  </button>

                  {showTooltip && (
                    <div className="dark-tooltip-bubble" role="tooltip">
                      <div className="tooltip-bubble-title">Practitioner Profile</div>
                      <div className="tooltip-bubble-text">
                        These credentials appear directly on patient bookings.
                      </div>
                      <div className="tooltip-arrow" />
                    </div>
                  )}
                </div>

                {generalError && (
                  <span className="settings-error-badge" role="alert">
                    {generalError}
                  </span>
                )}

                {saved ? (
                  <span className="saved-status-badge">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                ) : (
                  <button
                    type="submit"
                    disabled={!isDirty || isSubmitting || !isValid}
                    className="btn-primary-action"
                    title={!isDirty ? 'No changes to save' : 'Click to save your profile changes'}
                  >
                    <Check size={14} />
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="settings-divider-rule" />

            <div className="settings-fields-stack">
              <div className="settings-field-row">
                <div className="field-label-cell">
                  <label htmlFor="name">Name</label>
                </div>
                <div className="field-control-cell">
                  <div className={`modern-input-group single ${errors.name ? 'has-error' : ''}`}>
                    <input
                      id="name"
                      type="text"
                      className="input-group-text"
                      placeholder="Doctor Name"
                      {...register('name')}
                    />
                  </div>
                  {errors.name && (
                    <span className="field-validation-error">{errors.name.message}</span>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'social' && (
          <DoctorSocialLinksTab
            links={socialLinks}
            onSave={handleSaveSocialLinks}
            isSaving={isSavingSocial}
            saved={savedSocial}
            errorMessage={socialSaveError}
          />
        )}

        {activeTab === 'devices' && (
          <div className="settings-tab-pane">
            <DoctorSessionsCard />
          </div>
        )}
      </div>
    </div>
  );
});

DoctorSettingsPage.displayName = 'DoctorSettingsPage';
