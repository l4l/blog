<!-- 2020/06/01 13:54:10 -->
# Mutex in async world

Ever met with the following error while playing around with a `std::sync::Mutex` in async code?

```rust
 7  |     tokio::spawn(/* some future here */);
    |     ^^^^^^^^^^^^ future returned by `fut` is not `Send`
    |
127 |         T: Future + Send + 'static,
    |                     ---- required by this bound in `tokio::task::spawn::spawn`
    |
```

As the error message states, that happens due to unimplemented [`Send`](https://doc.rust-lang.org/std/marker/trait.Send.html) trait for the passed future. With an async-await feature that happens because you try to carry `!Send` object over await point(s). One particularly interesting case is locking a mutex from the standard library.

Once a [`Mutex`](https://doc.rust-lang.org/std/sync/struct.Mutex.html) is locked, it is possible to mutate the inner object with a special [`MutexGuard`](https://doc.rust-lang.org/std/sync/struct.MutexGuard.html) wrapper type. That is the one that cannot be sent between threads and aforementioned error. The reason of `!Send` behaviour directly implies from mutex unlocking specifications of underlying OS functions (e.g. pthread_mutex_unlock and ReleaseMutex), and on its own should be quite intuitive why.

Let's try to look how to solve that issue with the following (not-working) example:

```rust
use std::sync::Mutex;

#[tokio::main]
async fn main() {
    let counter = Mutex::new(0);

    tokio::spawn(async move {
        let _guard = counter.lock().unwrap();
        async {}.await;
    });
}
```

That example is overly simplified (e.g. without `Arc` it's quite useless) and even redundant (e.g. counter can be simply replaced with an atomic) but that should work fine for demonstration purposes. I will only show examples with tokio 2.0 because mostly I'm used to it. Nevertheless, everything looks similarly for [futures 3.0](https://crates.io/crates/futures), [async-std](https://crates.io/crates/async_std), [smol](https://crates.io/crates/smol), or probably any other async runtime unless specified explicitly.

## Pinning up a task

Since the sending is a requirement of multithreading, one possible way to handle that is simply pinning up a task to a single thread (or using a specialized single-threaded runtime like [futures::executor::LocalPool](https://docs.rs/futures/0.3.5/futures/executor/struct.LocalPool.html)). In this case, an executor runs the task only on the same thread where the future has been created. So the code will be the following:

```rust
// ...

let local = tokio::task::LocalSet::new();
local.spawn_local(async move {
        let _guard = counter.lock().unwrap();
        async {}.await;
    });

// Need to be explicitly awaited unlike `tokio::spawn`
local.await;
```

This code works though a bit differently comparing to the original. If this thread is overloaded it cannot offload local tasks to another one, in extreme cases it may lead to starvation of CPU cores. Moreover it is a workaround rather a solution that may lead to more significant problems. As you probably aware, rust does not protect from deadlocks and that is exactly the way it easy to get. Consider another task that also works with the same mutex and async point showed earlier is actually waiting for the second task. After switch at await point the second task is going to be blocked which leads to the deadlock state. So generally, using the shared state using `!Send`-spawn as a workaround is a bad idea. One might consider a [`RefCell`](https://doc.rust-lang.org/std/cell/struct.RefCell.html) for single-threaded usage, or using different solutions.

## Restraining a lifetime

Another trick, rather than a general solution, might be a lifetime reconsidering of `MutexGuard`. In the example dropping occurred at the end of the scope, i.e. after `await`. Since the switching among threads can only happen at awaiting points, it is still possible to use `!Send` objects within those bounds. As for this particular example dropping a guard right before async function will also work:

```rust
// ...

tokio::spawn(async move {
    // For one-liner it looks better with omitted variable declaration.
    let guard = counter.lock().unwrap();
    // ..
    drop(guard);

    async {}.await;
});
```

In practice, the solution above should work for most of the cases. But there are still some of them that are not covered. For example, one might consider using a critical section for some data and pass it to several futures without unlocking. For that case mutex cannot be maintained by OS, thus used from the standard library, but rather implemented on top of async executor runtime.

## Async Mutex

So the last and a rather comprehensive solution is an asynchronous mutex. Note though, smol does not provide that mechanism but it can be done manually or with the help of third-party crate (take a look at [async_mutex](https://crates.io/crates/async_mutex) for example). Here is a complete usage example:

```rust
use tokio::sync::Mutex;

#[tokio::main]
async fn main() {
    let counter = Mutex::new(0);

    tokio::spawn(async move {
        let _guard = counter.lock().await;
        async {}.await;
    });
}
```

As you may notice, besides the extraction an `await` from `lock()` call, unwrap is removed. Locking for standard mutex produces a result that indicates whether the previous thread-acquirer has panicked or not. In the async mutex locking is a future with guard output without any additional result. Therefore in async runtime, such an error is lost. Panicking in a task while handling a mutex guard leads to a mutex unlock. That is quite nice because you don't need to handle errors, but on the other hand it is quite easy to get an inconsistent state of guarded object.

The another issue with an async mutex is a deadlock behaviour. As you probably aware, rust does not protect from deadlocks and, of course, the async version is not an exception. But quite an important issue that it is substantially hard to debug it. Deadlock on async mutex does not block its threads, but only tasks. So while there is a normal CPU load of your process, you might miss blocked tasks. On the process deadlock you can notice a zero load and after attaching with a debugger and may see a blocked syscall. On the async deadlock mutex state is stored in executor (or third-party crate) internal structure.

## Conclusion

Several trade-offs should be taken into account while choosing the right approach. Firstly, make sure that you even need a mutex and whether you need a multi-threaded executor. Then the decision is quite simple: either use a standard mutex if it is not shared across await points otherwise use an async one. The last statement possibly is not always correct, so for the pickiest ones, it is always better to write relevant benchmark.

**Update:** note deadlock problem with pinning, thanks [to Darksonn](https://www.reddit.com/r/rust/comments/guivuf/mutex_in_async_world/fsiovij/).

You may leave a comment on [reddit](https://www.reddit.com/r/rust/comments/guivuf/mutex_in_async_world/).
