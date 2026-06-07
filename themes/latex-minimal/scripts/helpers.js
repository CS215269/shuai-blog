/**
 * Helper: returns current year for footer copyright.
 */
hexo.extend.helper.register('year', function () {
  return new Date().getFullYear();
});
