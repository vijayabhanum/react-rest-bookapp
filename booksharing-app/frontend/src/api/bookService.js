import axiosInstance from "./axios";

export const bookService = {
  getAllBooks: (searchTerm = '', ordering = '') => {
    let url = 'books/';
    const params = new URLSearchParams;

    if (searchTerm) params.append('search', searchTerm);
    if (ordering) params.append('ordering', ordering);

    if (params.toString()) url += `?${params.toString()}`;

    return axiosInstance.get(url);
  },

  getBookById: (id) => {
    return axiosInstance.get(`books/${id}`);
  },

  getBooksByTag: (tagName) => {
    return axiosInstance.get(`books/by_tag/?tag=${tagName}`);
  },

  createBook: (bookData) => {
    return axiosInstance.post('books/', bookData);
  },

  updateBook: (id, bookData) => {
    return axiosInstance.put(`books/${id}/`, bookData);
  },

  deleteBook: (id) => {
    return axiosInstance.delete(`books/${id}/`);
  },
};


export const authorService = {
  getAllAuthors: () => {
    return axiosInstance.get('authors/');
  },

  getAuthorById: (id) => {
    return axiosInstance.get(`authors/${id}/`);
  },

  createAuthor: (authorData) => {
    return axiosInstance.post('authors/', authorData);
  },
};


export const tagService = {
  getAllTags: () => {
    return axiosInstance.get('tags/');
  },

  createTag: (tagData) => {
    return axiosInstance.post('tags/', tagData);
  },
};

