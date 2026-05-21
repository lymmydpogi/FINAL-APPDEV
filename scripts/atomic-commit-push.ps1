# Atomic commits for Campana client app — run from repo root
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

function Commit-Files {
    param([string]$Message, [string[]]$Files)
    if (-not $Files -or $Files.Count -eq 0) {
        throw "No files for commit: $Message"
    }
    git add -A -- @Files
    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { throw "git commit failed: $Message" }
    Write-Host "OK $Message" -ForegroundColor Green
}

$commits = @(
    @{ M = 'chore(gitignore): ignore local api config override'; F = @('.gitignore') },
    @{ M = 'chore(env): add environment variable example template'; F = @('.env.example') },
    @{ M = 'docs(readme): note lucide icons for client ui'; F = @('README.md') },
    @{ M = 'docs(readme): add webapp integration and manual test guide'; F = @('README-WEBAPP.md') },
    @{ M = 'chore(deps): add navigation firebase and client libraries'; F = @('package.json', 'package-lock.json') },
    @{ M = 'chore(metro): use default config for faster bundling'; F = @('metro.config.js') },
    @{ M = 'chore(app): set display name to Campana Designs'; F = @('app.json') },
    @{ M = 'feat(theme): add design system tokens'; F = @('src/theme/colors.ts', 'src/theme/spacing.ts', 'src/theme/shadows.ts', 'src/theme/typography.ts', 'src/theme/tokens.ts', 'src/theme/index.ts') },
    @{ M = 'feat(types): add api navigation and redux types'; F = @('src/types/api.ts', 'src/types/navigation.ts', 'src/types/redux.ts', 'src/types/svgIcon.ts') },
    @{ M = 'feat(utils): add api envelope parser'; F = @('src/utils/apiEnvelope.ts') },
    @{ M = 'feat(constants): add mobile auth access messages'; F = @('src/constants/mobileAuth.ts') },
    @{ M = 'feat(constants): add order status and website copy'; F = @('src/constants/orderStatus.ts', 'src/constants/websiteCopy.ts') },
    @{ M = 'feat(constants): add messages and client services constants'; F = @('src/constants/messages.ts', 'src/constants/clientServices.ts') },
    @{ M = 'feat(utils): add format slugify and icon helpers'; F = @('src/utils/format.ts', 'src/utils/slugify.ts', 'src/utils/chipIcons.ts', 'src/utils/serviceIcons.ts') },
    @{ M = 'feat(utils): add order and service navigation helpers'; F = @('src/utils/orderNavigation.ts', 'src/utils/orderStatusColors.ts', 'src/utils/serviceStatus.ts', 'src/utils/navigationHelpers.ts', 'src/utils/navigateAfterAuth.ts') },
    @{ M = 'feat(utils): add auth session helpers'; F = @('src/utils/authSession.ts') },
    @{ M = 'feat(utils): add mobile auth guard for post-login'; F = @('src/utils/mobileAuthGuard.ts') },
    @{ M = 'feat(auth): add friendly api error message helpers'; F = @('src/utils/authErrorMessage.ts') },
    @{ M = 'feat(store): add redux store reference helper'; F = @('src/store/storeRef.ts') },
    @{ M = 'feat(api): add legacy api client layer'; F = @('src/api/apiClient.ts', 'src/api/apiService.ts', 'src/api/authToken.ts', 'src/api/config.ts', 'src/api/paths.ts', 'src/api/tokenStorage.ts') },
    @{ M = 'feat(services): add api config routes and override example'; F = @('src/services/config.ts', 'src/services/apiRoutes.ts', 'src/services/apiConfig.override.example.ts') },
    @{ M = 'feat(services): add axios client with auth interceptors'; F = @('src/services/apiClient.ts') },
    @{ M = 'feat(auth): add auth profile and verify email services'; F = @('src/services/authApi.ts', 'src/services/profileApi.ts', 'src/services/verifyEmailApi.ts') },
    @{ M = 'feat(auth): add google token exchange api service'; F = @('src/services/googleAuthApi.ts') },
    @{ M = 'feat(services): add catalog and services apis'; F = @('src/services/catalogApi.ts', 'src/services/servicesApi.ts') },
    @{ M = 'feat(orders): add orders api and error handling'; F = @('src/services/ordersApi.ts', 'src/services/orderApiError.ts') },
    @{ M = 'feat(messages): add messages api and chat storage'; F = @('src/services/messagesApi.ts', 'src/services/messageApiError.ts', 'src/services/chatNotificationsStorage.ts') },
    @{ M = 'feat(notifications): add notifications service and storage'; F = @('src/services/notificationsService.ts', 'src/services/notificationsStorage.ts', 'src/services/notificationsRefresh.ts') },
    @{ M = 'feat(contact): add contact api services'; F = @('src/services/contactApi.ts', 'src/services/contactService.ts') },
    @{ M = 'refactor(redux): extend auth actions for bootstrap and google'; F = @('src/app/actions.ts') },
    @{ M = 'refactor(redux): extend auth reducer for session bootstrap'; F = @('src/app/reducers/auth.ts') },
    @{ M = 'fix(redux): disable persist rehydrate timeout on android'; F = @('src/app/reducers/index.ts') },
    @{ M = 'refactor(redux): update legacy auth api module'; F = @('src/app/api/auth.ts') },
    @{ M = 'feat(redux): add auth saga for login google and bootstrap'; F = @('src/app/sagas/auth.ts') },
    @{ M = 'refactor(redux): register auth saga watcher'; F = @('src/app/sagas/index.ts') },
    @{ M = 'feat(context): add toast provider'; F = @('src/context/ToastContext.tsx') },
    @{ M = 'feat(hooks): add useAuth hook'; F = @('src/hooks/useAuth.ts') },
    @{ M = 'feat(auth): add google sign-in native module'; F = @('src/auth/googleSignIn.ts', 'src/auth/googleWebClientId.ts') },
    @{ M = 'docs(auth): add google sign-in setup guide'; F = @('src/auth/GOOGLE_SIGN_IN_SETUP.md') },
    @{ M = 'chore(auth): add google sign-in example component'; F = @('src/auth/GoogleSignInExample.tsx') },
    @{ M = 'feat(components): add campana background and screen layout'; F = @('src/components/CampanaBackground.tsx', 'src/components/ScreenLayout.tsx') },
    @{ M = 'feat(components): add card primary gradient and custom input'; F = @('src/components/Card.tsx', 'src/components/PrimaryGradient.tsx', 'src/components/CustomInput.tsx') },
    @{ M = 'style(components): enhance custom button variants'; F = @('src/components/CustomButton.tsx') },
    @{ M = 'style(components): enhance custom text input styling'; F = @('src/components/CustomTextInput.tsx') },
    @{ M = 'feat(components): add shared icons and header back'; F = @('src/components/CampanaIcons.tsx', 'src/components/HeaderBack.tsx') },
    @{ M = 'feat(components): add component barrel exports'; F = @('src/components/index.ts') },
    @{ M = 'feat(components): add auth gate and bootstrap gate'; F = @('src/components/AuthGate.tsx', 'src/components/BootstrapGate.tsx') },
    @{ M = 'feat(components): add auth interceptors for access denied'; F = @('src/components/AuthInterceptors.tsx') },
    @{ M = 'feat(components): add client header with actions'; F = @('src/components/ClientHeaderAuth.tsx') },
    @{ M = 'feat(components): add order and service status badges'; F = @('src/components/OrderStatusBadge.tsx', 'src/components/ServiceStatusBadge.tsx') },
    @{ M = 'feat(chat): add chat message bubble component'; F = @('src/components/ChatMessageBubble.tsx') },
    @{ M = 'feat(hooks): add chat and notification unread hooks'; F = @('src/hooks/useChatUnread.ts', 'src/hooks/useNotificationUnread.ts') },
    @{ M = 'feat(hooks): add admin reply notifier hook'; F = @('src/hooks/useAdminReplyNotifier.ts') },
    @{ M = 'feat(notifications): add admin reply notifier component'; F = @('src/components/AdminReplyNotifier.tsx') },
    @{ M = 'refactor(nav): remove legacy auth and main navigators'; F = @('src/navigations/AuthNav.tsx', 'src/navigations/MainNav.tsx') },
    @{ M = 'feat(nav): add client tab navigation'; F = @('src/navigations/ClientTabs.tsx') },
    @{ M = 'feat(nav): add root stack navigation and deep linking'; F = @('src/navigations/RootNav.tsx', 'src/navigations/linking.ts') },
    @{ M = 'feat(nav): add navigation ref and screen options'; F = @('src/navigations/navigationRef.ts', 'src/navigations/screenOptions.tsx') },
    @{ M = 'refactor(nav): wire navigation entry with root stack'; F = @('src/navigations/index.tsx') },
    @{ M = 'refactor(routes): expand client route constants'; F = @('src/utils/routes.ts') },
    @{ M = 'refactor(screens): remove placeholder home screen'; F = @('src/screens/HomeScreen.tsx') },
    @{ M = 'feat(screens): add client landing screen'; F = @('src/screens/client/LandingScreen.tsx') },
    @{ M = 'feat(screens): add services list and detail screens'; F = @('src/screens/client/ServicesScreen.tsx', 'src/screens/client/ServiceDetailScreen.tsx') },
    @{ M = 'feat(screens): add about and contact screens'; F = @('src/screens/client/AboutScreen.tsx', 'src/screens/client/ContactScreen.tsx') },
    @{ M = 'feat(orders): add my orders order detail and edit screens'; F = @('src/screens/client/MyOrdersScreen.tsx', 'src/screens/client/OrderDetailScreen.tsx', 'src/screens/client/OrderEditScreen.tsx') },
    @{ M = 'feat(messages): add client messages screen'; F = @('src/screens/client/MessagesScreen.tsx') },
    @{ M = 'feat(notifications): add notifications screen'; F = @('src/screens/client/NotificationsScreen.tsx') },
    @{ M = 'feat(auth): redesign login screen for client app'; F = @('src/screens/auth/Login.tsx') },
    @{ M = 'feat(auth): redesign register screen for client app'; F = @('src/screens/auth/Register.tsx') },
    @{ M = 'feat(auth): add email verification screens'; F = @('src/screens/auth/VerifyEmailScreen.tsx', 'src/screens/auth/VerifyEmailPendingScreen.tsx') },
    @{ M = 'feat(profile): redesign profile with avatar upload'; F = @('src/screens/ProfileScreen.tsx') },
    @{ M = 'chore(assets): update brand logo image'; F = @('asset/img/logomain.png', 'src/utils/images.ts') },
    @{ M = 'refactor(utils): export brand name from images helper'; F = @('src/utils/index.ts') },
    @{ M = 'feat(app): wire providers bootstrap and navigation'; F = @('App.tsx') },
    @{ M = 'chore(android): tune gradle build performance and dev abi'; F = @('android/gradle.properties') },
    @{ M = 'chore(android): add firebase gradle plugins'; F = @('android/build.gradle', 'android/app/build.gradle') },
    @{ M = 'chore(android): add google services configuration'; F = @('android/app/google-services.json') },
    @{ M = 'feat(android): add verify-email deep link intent filter'; F = @('android/app/src/main/AndroidManifest.xml') },
    @{ M = 'chore(android): add safe clean script and npm commands'; F = @('scripts/clean-android.mjs') },
    @{ M = 'chore(android): update debug keystore'; F = @('android/app/debug.keystore') }
)

Write-Host "`n=== Planned $($commits.Count) commits ===`n" -ForegroundColor Cyan
$i = 1
foreach ($c in $commits) {
    Write-Host ("{0,2}. {1}" -f $i, $c.M)
    $i++
}

foreach ($c in $commits) {
    Commit-Files -Message $c.M -Files $c.F
}

$remaining = git status --short
if ($remaining) {
    Write-Host "`nWARNING: Uncommitted files remain:" -ForegroundColor Yellow
    Write-Host $remaining
    exit 1
}

Write-Host "`n=== git log --oneline (last 20) ===`n" -ForegroundColor Cyan
git log --oneline -20

Write-Host "`nPushing to origin/main..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'git push failed' }
Write-Host "Push completed." -ForegroundColor Green
