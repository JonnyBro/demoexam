# DemoExam

Demo exam repo.

## Install dependencies

> [!NOTE]
> You can replace `pnpm` with `npm` if you don't have it.

```sh
pnpm i
```

## Production mode

```sh
pnpm build
pnpm start
```

## Dev mode

```sh
pnpm dev
```

## API Endpoints

`GET /`

* Main page
* Redirects to `/auth` if user is not authenticated.
* Redirects to `/orders` if user is present.

`GET /auth`

* Authentication page.
* Redirects to `/orders` after successful authentication.

`POST /auth`

* Allows a user to login or logout (`/auth/logout`).
* Requires `user` and `password` in the request's body.
* Redirects to `/orders` after successful authentication.

`GET /orders`

* Returns a page with the list of all orders.

`POST /orders`

* Creates an order.
* Requires `device`, `client`, `description`, `status`, `problemType` in the request's body.

`PUT /orders/:id`

* Allows to update order's `description` and `status`.
* Requires `description` and/or `status` in the request's body.

`DELETE /orders/:id`

* Allows to delete orders.

`POST /orders/assign-master/:id`

* Allows to set a master of an order.
* Requires `master` in the request's body.
