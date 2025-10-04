# IEP Goals Redirect Fix

## Issue
The IEP Goals page (https://behaviorschool.com/iep-goals) was not correctly redirecting users to the free generator widget after email signup.

## Root Cause
**Race condition between popup closing and redirect:**

1. `EmailSignupPopup` component: Called `onSuccess()` then closed popup after 2 seconds
2. `handleSignupSuccess` in AnimatedSections: Tried to close popup AND redirect after 100ms
3. **Result**: Conflicting timing caused redirect to fail or be blocked

## Files Changed

### 1. `/src/app/iep-goals/AnimatedSections.tsx` (Lines 20-33)

**Before:**
```typescript
const handleSignupSuccess = () => {
  console.log('IEP Goals: handleSignupSuccess called');
  if (typeof window !== 'undefined') {
    localStorage.setItem('hasSignedUpForIEPWidget', 'true');
    console.log('IEP Goals: localStorage flag set');
  }
  setIsSignupOpen(false);  // ❌ Closing popup too early
  console.log('IEP Goals: Redirecting to widget page...');
  setTimeout(() => {
    router.push("/iep-behavior-goals/widget");  // ❌ Delayed redirect
  }, 100);
};
```

**After:**
```typescript
const handleSignupSuccess = () => {
  console.log('IEP Goals: handleSignupSuccess called');
  if (typeof window !== 'undefined') {
    localStorage.setItem('hasSignedUpForIEPWidget', 'true');
    console.log('IEP Goals: localStorage flag set');
  }

  // ✅ Let EmailSignupPopup component handle closing
  // setIsSignupOpen(false);

  console.log('IEP Goals: Redirecting to widget page...');
  // ✅ Redirect immediately
  router.push("/iep-behavior-goals/widget");
};
```

### 2. `/src/components/ui/email-signup-popup.tsx` (Lines 82-91)

**Before:**
```typescript
setIsSubmitted(true);
if (onSuccess) {
  console.log('EmailSignupPopup: Calling onSuccess');
  onSuccess();
  // ❌ 2 second delay was too long
  setTimeout(() => {
    onClose();
    setIsSubmitted(false);
  }, 2000);
}
```

**After:**
```typescript
setIsSubmitted(true);
if (onSuccess) {
  console.log('EmailSignupPopup: Calling onSuccess');
  // ✅ Call onSuccess immediately (handles redirect)
  onSuccess();
  // ✅ Shorter delay for faster redirect experience
  setTimeout(() => {
    onClose();
    setIsSubmitted(false);
  }, 500); // Reduced from 2000ms to 500ms
}
```

## How It Works Now

1. ✅ User enters name and email in popup
2. ✅ Form submits to `/api/newsletter`
3. ✅ On success, `onSuccess()` callback is called immediately
4. ✅ `handleSignupSuccess` in AnimatedSections:
   - Sets localStorage flag
   - **Redirects to `/iep-behavior-goals/widget` immediately**
5. ✅ Popup closes 500ms after redirect starts (gives time for navigation)
6. ✅ User sees the IEP Behavior Goals Widget

## Testing Checklist

- [ ] Visit https://behaviorschool.com/iep-goals
- [ ] Click "Start Creating Goals Free" button
- [ ] Enter name and email in popup
- [ ] Click "Access Generator"
- [ ] **Expected**: Redirect to `/iep-behavior-goals/widget` within 1 second
- [ ] **Expected**: See IEP Behavior Goals Widget page load
- [ ] **Expected**: localStorage has `hasSignedUpForIEPWidget: true`

## Console Log Verification

When testing, you should see:
```
IEP Goals: handleSignupSuccess called
IEP Goals: localStorage flag set
IEP Goals: Redirecting to widget page...
EmailSignupPopup: API response OK
EmailSignupPopup: Calling onSuccess
```

## Additional Notes

- **localStorage flag**: `hasSignedUpForIEPWidget` is set to prevent showing popup again
- **Redirect target**: `/iep-behavior-goals/widget`
- **Success message**: "Thanks! Redirecting you to the IEP Goal Generator..."
- **Popup delay**: 500ms (down from 2000ms) for faster UX

## Deploy

Changes are ready to deploy. The redirect should now work correctly.

```bash
cd "/Users/robspain/Desktop/marketing suite"
npm run build
netlify deploy --prod
```

## Related Files

- `/src/app/iep-goals/page.tsx` - Landing page
- `/src/app/iep-goals/AnimatedSections.tsx` - Main component with signup logic
- `/src/app/iep-behavior-goals/widget/page.tsx` - Widget destination
- `/src/components/ui/email-signup-popup.tsx` - Reusable popup component
