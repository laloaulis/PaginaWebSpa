# Copilot Instructions for proyecto-webapp

## Project Overview
Angular 16 single-page application with a modular screen-based architecture. This is a service-oriented web app with authentication guards, routing-based navigation, and a facade pattern for API interactions. Backend API runs on `http://localhost:8000/api/`.

## Architecture & Key Patterns

### Component Structure
- **Standalone Components**: All feature components (screens) use `standalone: true` pattern
  - Example: `InicioScreenComponent` imports dependencies directly via `imports: []` array
  - Screens located in `src/app/screens/` directory (e.g., `inicio-screen/`, `contacto/`, `servicios/`)
  - Each screen is a self-contained module with its own styling and logic

### Service Layer (Facade Pattern)
- **FacadeService** (`services/facade.service.ts`): Central service handling API communication, validation, and cookie management
  - Manages session cookies: `proyecto-tecnologias-token`, `-email`, `-user_id`, `-user_complete_name`, `-group_name`, `-codigo`
  - Includes built-in validation via `ValidatorService` before HTTP requests
  - Uses `CookieService` (ngx-cookie-service) for persistence
  - API requests include error handling through `ErrorsService`

- **AuthService** (`services/auth.service.ts`): Dedicated login endpoint handling
  - Posts to `{baseUrl}/login/` with email/password payload
  - Returns Observable for reactive handling

### Authentication & Routing
- **AuthGuard** (`guards/auth.guard.ts`): Route protection checking `localStorage.access_token`
  - Redirects unauthenticated users to `/login-screen`
  - Applied to protected routes in routing module
- **Router Configuration** (`app-routing.module.ts`): Simple routes array, includes InicioScreenComponent as default route

### Supporting Services
- **ValidatorService**: Provides utility methods (`required()`, `max()`, `email()`, etc.)
- **ErrorsService**: Returns localized error messages for validation failures

## Development Workflow

### Commands
```bash
npm start          # Serve dev server on localhost:4200
npm run build      # Production build to dist/
npm run watch      # Watch mode for development
npm test           # Run Karma tests (jasmine-core)
ng generate component <name>  # Generate new component
```

### Key Dependencies
- **Angular 16**: Core framework
- **Angular Material & Bootstrap 5**: UI components
- **RxJS 7.8**: Reactive streams (Observable-based services)
- **ngx-cookie-service**: Cookie management
- **TypeScript 5.1**: Language

## Critical Developer Notes

### HTTP & Environment
- Base API URL defined in `environment.ts` as `url_api`
- Use `HttpClient` injected via FacadeService for all API calls
- Environment switching: dev (`environment.ts`) vs prod (`environment.prod.ts`) via Angular build replacement

### Cookie-Based Auth Flow
- Token stored in cookie `proyecto-tecnologias-token` AND potentially `localStorage.access_token`
- After login, user metadata (email, ID, name, group) cached in cookies for session persistence
- Validation happens in FacadeService before submission (email format, required fields, max length)

### Component Composition Pattern
- Root component (`app.component.ts`) handles header/shell
- Screens are composable (e.g., InicioScreenComponent imports ServiciosComponent, GaleriaComponent, etc.)
- Use `ViewChild` + `@HostListener` for scroll events and DOM manipulation
- ViewEncapsulation.None used when component styles need to affect child selectors

### Testing Convention
- Test files co-located: `*.spec.ts` next to implementation
- Karma + Jasmine framework (4.6.0)
- Run with `npm test`

## Common Tasks for AI Agents

**Adding a New Screen**
1. Generate with `ng generate component screens/new-screen`
2. Mark as `standalone: true` and include necessary imports
3. Add route to `app-routing.module.ts`
4. Apply `AuthGuard` if protected

**Calling API**
1. Inject FacadeService (already at `providedIn: 'root'`)
2. Call its validation methods first (e.g., `validarLogin()`)
3. Handle response/errors through Observable subscription
4. Store auth data in cookies via FacadeService methods

**Form Validation**
1. Use `ValidatorService` methods: `required()`, `email()`, `max()`, `min()`, etc.
2. Get error messages from `ErrorsService` 
3. Pattern: validate in component, display errors in template

## Project-Specific Conventions
- **Spanish naming** for user-facing features (componentes: "contacto", "servicios", "equipo", "ubicacion", "galeria", "acerca-de")
- **Cookie prefix**: All session cookies prefixed with `"proyecto-tecnologias-"`
- **Debounce pattern**: InicioScreenComponent uses debounce for scroll events (see `scrollTimeout`, `debounceTime` variables)
- **No standalone modules except screens**: Other components/directives must be declared in app.module or feature modules
