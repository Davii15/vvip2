/**
 * Utility functions for swapping elements in arrays
 */

/**
 * Swaps elements in an array at random positions
 * @param array The array to swap elements in
 * @returns A new array with swapped elements
 */
export function swapArrayElementsRandomly<T>(array: T[]): T[] {
    if (array.length <= 1) return [...array]
  
    const newArray = [...array]
  
    // Perform multiple swaps for better randomization
    for (let i = 0; i < Math.max(1, Math.floor(array.length / 2)); i++) {
      const index1 = Math.floor(Math.random() * array.length)
      let index2 = Math.floor(Math.random() * array.length)
  
      // Make sure we're not swapping an element with itself
      while (index2 === index1) {
        index2 = Math.floor(Math.random() * array.length)
      }
      // Swap elements
      ;[newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]]
    }
  
    return newArray
  }
  
  /**
   * Swaps vendors within each category
   * @param vendors The vendors array
   * @returns A new array with swapped vendors
   */
  export function swapVendorsWithinCategory<T extends { id: number }>(vendors: T[]): T[] {
    return swapArrayElementsRandomly(vendors)
  }
  
  