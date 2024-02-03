export const environment = {
  production: true,

  baseUrl: '/admin',

  // get movieterms content
  getMovieTerms: '/admin-service/api/rest/v1/manage-movies/get-all-moviesTerms',
  // get contents from file ID
  fileIdContent: '/file-service/api/rest/v1/file/html/',
  fileUploadService: '/file-service/api/rest/v1/file/',
  //down load terms
  termsDownloadedContent: '/file-service/api/rest/v1/file/download/',

  getAllZonePath: '/admin-service/api/rest/v1/manage/get-all-zones',
  getAllLocalityPath: '/admin-service/api/rest/v1/manage/get-all-localities',
  getAllVenueCategoryPath:
    '/admin-service/api/rest/v1/manage-venues/get-all-venue-categories',
  getAllMoviePath: '/admin-service/api/rest/v1/manage-movies/get-all-movies',
  getAllGenrePath: '/admin-service/api/rest/v1/manage-movies/get-all-genres',
  viewCompanyPath:
    '/admin-service/api/rest/v1/manage-companies/get-all-companies',
  getAllActiveCompanyPath:
    '/admin-service/api/rest/v1/manage-companies/get-all-active-companies',
  viewAllVenuePath: '/admin-service/api/rest/v1/manage-venues/get-all-venues',
  getAllVenueByCompanyPath:
    '/admin-service/api/rest/v1/manage-venues/get-venues-of-company',
  viewAllScreenPath:
    '/admin-service/api/rest/v1/manage-screens/get-screens-of-venue',
  getScreenDetails: '/admin-service/api/rest/v1/manage-screens/get-screen-details',
  getAllClassesByScreen:
    '/admin-service/api/rest/v1/manage-seat-layout/get-all-classs-of-screen',
  getAllChargePath: '/fare-service/api/rest/v1/charge/get/all',
  getAllTaxPath: '/fare-service/api/rest/v1/tax/get/all',
  getAllFarePath: '/fare-service/api/rest/v1/fare/get/all',
  getFarePath: '/fare-service/api/rest/v1/fare/get',
  getAllExperience: '/admin-service/api/rest/v1/manage-screens/all/experience',

  //Critic Review
  addCriticReview: '/admin-service/api/rest/v1/manage-review/critic/store',
  deleteCriticReview: '/admin-service/api/rest/v1/manage-review/critic/purge',
  editCriticReview: '/admin-service/api/rest/v1/manage-review/critic/edit',
  fetchAllCriticReview: '/admin-service/api/rest/v1/manage-review/critic/reviews',

  //Box Office
  // createuserprofile:'/user-service/api/rest/v1/user/profile/create',

  // Publish Module
  deletePublishShowsPath:
    '/publish-service/api/rest/v1/reservation-publish/delete-published-shows',
  fetchLastPublishScreenDate:
    '/publish-service/api/rest/v1/reservation-publish/fetch-last-published-date-for-screen',
  newzonePath:
    '/publish-service/api/rest/v1/reservation-publish/setup-new-zone',
  savePublishData:
    '/publish-service/api/rest/v1/reservation-publish/publish-shows',
  editPublishData:
    '/publish-service/api/rest/v1/reservation-publish/modify-published-shows',
  getPublishedShows:
    '/publish-service/api/rest/v1/reservation-publish/get-published-shows',
  approvePublishedShows:
    '/publish-service/api/rest/v1/reservation-publish/approve-shows',
  seatingRepresentation: '/reservation-service/api/rest/v1/reservation/seatingRepresentation',
  selectedSeatPath: '/reservation-service/api/rest/v2/reservation/seat/booking/status',

  //Box office user
  userCredential: '/admin-service/api/rest/v1/box-office/user',
  getUserDetails: '/user-service/api/rest/v1/user/',
  getCredentialId: '/admin-service/api/rest/v1/box-office/user/',
  getVenueId: '/admin-service/api/rest/v1/box-office/',
  userDetails: '/user-service/api/rest/v1/user/',



  // Screen Module
  addScreenPath: '/admin-service/api/rest/v1/manage-screens/add-screen',
  addClassPath: '/admin-service/api/rest/v1/manage-seat-layout/add-class',
  addClassesAndSeatsPath:
    '/admin-service/api/rest/v1/manage-seat-layout/add-classes-seat-layout',
  addScreenLayoutToClassPath:
    '/admin-service/api/rest/v1/manage-seat-layout/add-seat-layout-to-class',
  deleteScreenPath: '/admin-service/api/rest/v1/manage-screens/delete-screen',

  updateScreenPath: '/admin-service/api/rest/v1/manage-screens/update-screen',
  updateClassPath: '/admin-service/api/rest/v1/manage-seat-layout/update-class',
  updateScreenLayoutToClassPath:
    '/admin-service/api/rest/v1/manage-seat-layout/update-seat-layout-of-class',

  viewAllClassesForScreenPath:
    '/admin-service/api/rest/v1/manage-seat-layout/get-all-classs-of-screen',
  viewAllSeatLayoutForClassPath:
    '/admin-service/api/rest/v1/manage-seat-layout/get-seat-layout-of-class',
  deleteScreenLayoutToClassPath:
    '/admin-service/api/rest/v1/manage-seat-layout/delete-seat-layout-of-class',

  // Zone
  addZonePath: '/admin-service/api/rest/v1/manage/add-zone',
  updateZonePath: '/admin-service/api/rest/v1/manage/update-zone',
  deleteZonePath: '/admin-service/api/rest/v1/manage/delete-zone',

  // Locality
  getLocalityPath: '/admin-service/api/rest/v2/locality/',
  addLocalityPath: '/admin-service/api/rest/v2/locality/',
  updateLocalityPath: '/admin-service/api/rest/v2/locality/',
  deleteLocalityPath: '/admin-service/api/rest/v2/locality/',


  //City
  getcitybystate: '/admin-service/api/rest/v2/city/country/',
  getcity: '/admin-service/api/rest/v2/city/',
  addcity: '/admin-service/api/rest/v2/city/',
  editcity: '/admin-service/api/rest/v2/city/',
  deletecity: '/admin-service/api/rest/v2/city/',

  // Venue Category
  addVenueCategoryPath:
    '/admin-service/api/rest/v1/manage-venues/add-venue-category',
  updateVenueCategoryPath:
    '/admin-service/api/rest/v1/manage-venues/update-venue-category',
  deleteVenueCategoryPath:
    '/admin-service/api/rest/v1/manage-venues/delete-venue-category',

  // Movie
  addMoviePath: '/admin-service/api/rest/v1/manage-movies/add-movie',
  updateMoviePath: '/admin-service/api/rest/v1/manage-movies/update-movie',
  deleteMoviePath: '/admin-service/api/rest/v1/manage-movies/delete-movie',

  // Cineast Cast and Crew
  addCineastMember: '/admin-service/api/rest/v1/cineast/member-add',
  updateCineastMember: '/admin-service/api/rest/v1/cineast/member-update',
  deleteCineastMember: '/admin-service/api/rest/v1/cineast/member-delete',
  getAllCineastMember: '/admin-service/api/rest/v1/cineast/member-get-all',
  getCineastMember: '/admin-service/api/rest/v1/cineast/member-get',

  addCineastRole: '/admin-service/api/rest/v1/cineast/role-add',
  updateCineastRole: '/admin-service/api/rest/v1/cineast/role-update',
  deleteCineastRole: '/admin-service/api/rest/v1/cineast/role-delete',
  getAllCineastRole: '/admin-service/api/rest/v1/cineast/role-get-all',
  getCineastRole: '/admin-service/api/rest/v1/cineast/role-get',

  getCineastMovie: '/admin-service/api/rest/v1/cineast/movie-get',
  getCineastMovieAdd: '/admin-service/api/rest/v1/cineast/movie-add',
  getCineastMoviedelete: '/admin-service/api/rest/v1/cineast/movie-delete',
  getAllCineastMovieMapping: '/admin-service/api/rest/v1/cineast/movie-get-all',

  // Genre
  addGenrePath: '/admin-service/api/rest/v1/manage-movies/add-genre',
  updateGenrePath: '/admin-service/api/rest/v1/manage-movies/update-genre',
  deleteGenrePath: '/admin-service/api/rest/v1/manage-movies/delete-genre',

  // Module-operation
  viewAllModuleOperationsPath:
    '/rbac-service/api/rest/v1/module/fetch-all-module-operations',
  deleteModuleOperationsPath:
    '/rbac-service/api/rest/v1/module-operation/delete',
  updateModuleAndOperationPath:
    '/rbac-service/api/rest/v1/module-operation/modify',
  addModuleAndOperationPath:
    '/rbac-service/api/rest/v1/module/create-module-operation',
  fetchAllUserRolePath: '/rbac-service/api/rest/v1/role/get-all-user-roles',
  fetchAllModulesPath:
    '/rbac-service/api/rest/v1/role/get/user/operation/access',
  addRoleAndRoleModuleOperationAccessPath:
    '/rbac-service/api/rest/v1/role/add',
  fetchRoleInformationPath: '/rbac-service/api/rest/v1/role/authorities',
  updateRoleAndRoleModuleOperationAccessPath:
    '/rbac-service/api/rest/v1/role/update-role-module-operation-access',
  deleteroles: '/rbac-service/api/rest/v1/role/delete',
  deleteuserrole: '/rbac-service/api/rest/v1/role/delete-user',

  // User Management
  authenticate: '/user-service/api/rest/v1/user/admin/authenticate',
  getAllRolePath: '/rbac-service/api/rest/v1/role/get-all',
  addUserPath: '/user-service/api/rest/v1/user/profile/create',
  updateUserProfilePath: '/user-service/api/rest/v1/user/profile/update',
  retrieveUserProfilePath: '/user-service/api/rest/v1/user/profile/retrieve',
  updatePassword: '/user-service/api/rest/v1/user/password/update',
  loginotp: '/user-service/api/rest/v1/user/authenticate/otp/initiate',
  validationotp: '/user-service/api/rest/v1/user/authenticate/otp/validation',
  // Company
  addCompanyPath: '/admin-service/api/rest/v1/manage-companies/add-company',
  updateCompanyPath:
    '/admin-service/api/rest/v1/manage-companies/update-company',
  deleteCompanyPath:
    '/admin-service/api/rest/v1/manage-companies/delete-company',
  getParticularCompany:
    '/admin-service/api/rest/v1/manage-companies/get-company-details',
  // Venue
  addVenuePath: '/admin-service/api/rest/v1/manage-venues/add-venue',
  updateVenuePath: '/admin-service/api/rest/v1/manage-venues/update-venue',
  deleteVenuePath: '/admin-service/api/rest/v1/manage-venues/delete-venue',
  getParticularVenuePath:
    '/admin-service/api/rest/v1/manage-venues/get-venue-details',
  // Charge
  addChargePath: '/fare-service/api/rest/v1/charge/create',
  updateChargePath: '/fare-service/api/rest/v1/charge/update',
  deleteChargePath: '/fare-service/api/rest/v1/charge/delete',

  // Fare
  addFarePath: '/fare-service/api/rest/v1/fare/create',
  updateFarePath: '/fare-service/api/rest/v1/fare/update',
  deleteFarePath: '/fare-service/api/rest/v1/fare/delete',

  // Tax
  addTaxPath: '/fare-service/api/rest/v1/tax/create',
  updateTaxPath: '/fare-service/api/rest/v1/tax/update',
  deleteTaxPath: '/fare-service/api/rest/v1/tax/delete',

  getAllCountries: '/location-service/api/rest/v1/location/country/all',
  getAllStates: '/location-service/api/rest/v1/location/region/all',

  // Review
  addReviewPath: '/admin-service/api/rest/v1/manage-screens/add/experience',
  updateReviewPath:
    '/admin-service/api/rest/v1/manage-screens/update/experience',
  getAllExperiencePath:
    '/admin-service/api/rest/v1/manage-screens/all/experience',
  deleteExperiencePath:
    '/admin-service/api/rest/v1/manage-screens/delete/experience',
  //Update SeatLayout Booking Status
  updateSeatLayoutBookingStatusPath: '/admin-service/api/rest/v1/manage-seat-layout/update-seatlayout-bookingstatus',


  // Role-Master
  addRoleMaster: '/rbac-service/api/rest/v2/role',
  editRoleMaster: '/rbac-service/api/rest/v2/role',
  getAllRoleMaster: '/rbac-service/api/rest/v2/role',
  deleteRoleMaster: '/rbac-service/api/rest/v2/role/',
  getRoleByRoleId: '/rbac-service/api/rest/v2/role/',
  getRoleByCompanyandSystemId: '/rbac-service/api/rest/v2/role/companyId/',

  // Authorization
  addAuthorization: '/rbac-service/api/rest/v2/authorizations',
  getAuthorizationById: '/rbac-service/api/rest/v2/authorizations/',
  getAllAuthorization: '/rbac-service/api/rest/v2/authorizations',
  deleteAuthorization: '/rbac-service/api/rest/v2/authorizations/',
  updateAuthorization: '/rbac-service/api/rest/v2/authorizations',
  getAuthorizationbyCompanyandSystemId: '/rbac-service/api/rest/v2/authorizations/companyId/',

  //System Path
  viewSystemPath: '/rbac-service/api/rest/v2/role/authorization',

  //role-user
  getAllRoleUser: '/rbac-service/api/rest/v2/role/user',
  addRoleUser: '/rbac-service/api/rest/v2/role/user',
  editRoleUser: '/rbac-service/api/rest/v2/role/user/update',
  deleteRoleUser: '/rbac-service/api/rest/v2/role/user/',
  getRoleUserById: '/rbac-service/api/rest/v2/role/user/id/',

  //role-authorization
  addeditRoleAuthorization: '/rbac-service/api/rest/v2/role/authorization',
  deleteRoleAuthorization: '/rbac-service/api/rest/v2/role/authorization/',
  getRoleAuthorizationbyId: '/rbac-service/api/rest/v2/role/authorization/'


};
