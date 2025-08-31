Project: bookcase-angular (Angular 19)

This document captures project-specific knowledge to help advanced contributors be productive quickly. It focuses on build/configuration, testing (with a runnable example), and development/debugging patterns unique to this repository.

1. Build and configuration
- Toolchain
  - Node: 22.x (Dockerfile should be updated to node:22.19.0 LTS). Use Node 22 LTS to meet Angular 19 requirements.
  - Package manager: npm (angular.json sets cli.packageManager to npm).
  - Angular CLI: ^19.2.15 (via devDependencies) with standalone APIs.
- Install
  - npm ci (preferred for reproducible installs) or npm install for local iteration.
- Development server
  - npm start (ng serve). Opens http://localhost:4200/. HMR enabled; source maps are enabled in the development build configuration.
- Production build
  - npm run build (defaults to production per angular.json). Output at dist/bookcase-angular/browser/.
  - For a development build with source maps: npm run build -- --configuration=development
- Dockerized build/run
  - docker/Dockerfile performs a two-stage build: Angular production build in node:22 -> static files served by nginx:1.19-alpine.
  - docker/docker-compose.yml expects an external Docker network named bookcase-network. If not present, create it once: docker network create bookcase-network
  - The README suggests running the Java backend (bookcase-java) before docker compose up. However, this Angular app also registers a FakeResponseInterceptor which serves deterministic responses for GET api/books[/*] and GET api/books?name=... and returns 404 for unknown numeric IDs:
    - Provider is wired in src/app/app.config.ts via HTTP_INTERCEPTORS.
    - If you want to hit a real backend, remove or conditionally disable the FakeResponseInterceptor provider.
  - Run container: docker compose -f docker/docker-compose.yml up
  - Static files are copied from dist/bookcase-angular/browser/ into nginx at /usr/share/nginx/html and routes are handled via try_files ... /index.html in docker/nginx.conf.

2. Testing
- Stack
  - Test runner: Karma (builder @angular-devkit/build-angular:karma).
  - Framework: Jasmine 5.x.
  - Browser: ChromeHeadless via karma-chrome-launcher (works out-of-the-box in CI; locally you need Chrome installed or use a CI/container that provides it).
  - Polyfills include zone.js and zone.js/testing (from angular.json test.options.polyfills).
- Commands
  - Run entire suite (opens a browser unless in CI): npm test
    - CI-friendly headless run: npm test -- --watch=false --browsers=ChromeHeadless
  - Run a subset via include filter (Angular 19+):
    - npm test -- --watch=false --browsers=ChromeHeadless --include=src/app/path/to/file.spec.ts
- Important notes specific to this repo
  - Some existing tests currently require additional providers to pass (e.g., ActivatedRoute, HttpClient). If you’re iterating on a single spec, prefer using the --include filter to run only the relevant file.
  - When testing services/components that inject HttpClient or make HTTP calls, use HttpClientTestingModule and HttpTestingController to avoid NullInjectorError and to assert outgoing requests.
  - For components that depend on route params or navigation, provide a mock for ActivatedRoute (e.g., with snapshot.params or paramMap observables) in TestBed.providers.
- How to add a new test (example verified during this update)
  - We validated the test infra with the following trivial spec executed in isolation using --include. This is the recommended workflow to smoke-test the setup without being affected by unrelated failing specs.
    - Create a spec, e.g., at src/app/example-smoke.spec.ts:
      
      describe('SmokeTest', () => {
        it('should run a trivial assertion', () => {
          expect(1 + 1).toBe(2);
        });
      });
      
    - Run it only:
      npm test -- --watch=false --browsers=ChromeHeadless --include=src/app/example-smoke.spec.ts
    - Expected result: "TOTAL: 1 SUCCESS". This was verified in the current session with an equivalent smoke test. After verification, remove the temporary spec file to keep the repo clean.
- Patterns for fixing/authoring tests here
  - Standalone components: Import the component under test in TestBed.imports (as done in src/app/book/book.component.spec.ts), and explicitly provide any required services.
  - Route dependencies: Provide ActivatedRoute with the shape your component expects. Example:
    {
      provide: ActivatedRoute,
      useValue: { snapshot: { paramMap: new Map([['id', '1']]) } }
    }
  - HTTP dependencies in services/components: add HttpClientTestingModule to imports and provide FakeResponseInterceptor only if you want to mimic app behavior in tests; otherwise keep tests deterministic by controlling HttpTestingController.

3. Additional development information
- Project structure and notable pieces
  - Angular v19 application using standalone APIs, no NgModule boilerplate for components.
  - Global providers are set up in src/app/app.config.ts via provideRouter and importProvidersFrom(HttpClientModule), plus the FakeResponseInterceptor.
  - FakeResponseInterceptor implements canned responses for api/books; useful for UI iteration without a backend.
  - Angular build configuration defaults to production; enable development config explicitly for debugging builds.
- Code style and conventions
  - TypeScript ~5.8; follow Angular Style Guide (selectors, file names, single responsibility, avoid logic in templates). There is no ESLint/tslint configured in this repo at the moment.
  - Prefer pure, input-driven components where possible; move I/O and side-effects into services (e.g., BookService).
- Debugging tips
  - For runtime HTTP inspection during local dev, keep FakeResponseInterceptor enabled; it logs interceptions with a counter to the console.
  - When switching to a real backend, remove the interceptor provider to avoid masking network issues.
  - Use development build or ng serve for source maps. In dockerized production, source maps are not included by default.
- Docker/deployment caveats
  - Ensure the external network bookcase-network exists before docker compose up, or change docker-compose.yml to create an internal network.
  - The compose file reads variables from docker/.env and sets the compose project name based on APPLICATION_NAME.

Appendix: Common snippets
- Provide HttpClientTestingModule and a mock service:
  
  import { HttpClientTestingModule } from '@angular/common/http/testing';
  
  await TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, YourStandaloneComponent],
    providers: [
      { provide: BookService, useValue: jasmine.createSpyObj('BookService', ['getBook']) }
    ]
  }).compileComponents();
  
- Mock ActivatedRoute for components reading route params:
  
  { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } }
