export default function () {
  return (
    <>
      {/* <div class="fixed top-0 left-0 right-0 bottom-0 z-[999999999] bg-white flex items-center justify-center space-x-4">
        <LoadingItem />
      </div> */}
    </>
  );
}

export function LoadingItem() {
  return (
    <>
      <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
      <div class="animate animate-pulse rounded-full p-3 bg-purple-600"></div>
      <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
    </>
  );
}
