export const useImagePath = (path) => {
    return new URL(`/src/assets/images/${ path }`,import.meta.url)
}