# bookcase-angular

Angular 22 application using standalone components and modern build system.

## Prerequisites

- **Node.js**: v20.19+, v22.22.3+, or v24.0+ (required for Angular 22)
- **npm**: 8.0+
- **Angular CLI**: 22.x

## Technology Stack

- **Angular**: 22.1.4
- **TypeScript**: 6.0.3
- **Build System**: @angular-devkit/build-angular:application
- **HTTP Client**: Modern provideHttpClient with functional interceptors
- **Testing**: Karma + Jasmine

## development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## run

First build and run [bookcase-java](https://github.com/george-postelnicu/bookcase-java/blob/main/README.md), then

```shell
docker compose -f docker/docker-compose.yml up
```

## stop

```shell
docker compose -f docker/docker-compose.yml down
```

## clean

To clean and remove cached Docker images so new changes are picked up:

```shell
docker compose -f docker/docker-compose.yml down --rmi local
```

Or rebuild the image without using cache:

```shell
docker compose -f docker/docker-compose.yml build --no-cache
```
