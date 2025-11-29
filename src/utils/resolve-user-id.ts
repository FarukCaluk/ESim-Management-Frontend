export const resolveUserId = (profile?: Record<string, any>) => {
  const fromProfile =
    profile?._id ??
    profile?.id ??
    profile?.userId ??
    profile?.user_id ??
    profile?.email ??
    profile?.name;

  if (fromProfile) return String(fromProfile);

  const fallbackKeys = ['userId', 'email', 'name'];
  for (const key of fallbackKeys) {
    const stored = localStorage.getItem(key);
    if (stored) return stored;
  }

  return '';
};
