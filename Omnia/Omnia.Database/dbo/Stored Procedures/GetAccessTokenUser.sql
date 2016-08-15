CREATE proc GetAccessTokenUser(
	@accessToken nvarchar(500),
	@applicationId int output
)
as
begin
	declare @userOAuthProviderId int
	declare @applicationOAuthProviderId int
	select
		@userOAuthProviderId = UserOAuthProviderId,
		@applicationOAuthProviderId = ApplicationOAuthProviderId,
		@applicationId = a.Id
	from
		UserOAuthProviderLogins
		inner join ApplicationOAuthProviders appProviders on ApplicationOAuthProviderId = appProviders.Id
		inner join Applications a on appProviders.ApplicationId = a.Id
	where
		AccessToken = @accessToken

	if @userOAuthProviderId is null
		return

	declare @lastAccessToken nvarchar(500)
	declare @publicUserId uniqueidentifier
	declare @pictureUri nvarchar(500)
	declare @providerId int
	declare @externalAccessToken nvarchar(500)
	declare @firstName nvarchar(500)
	declare @lastName nvarchar(500)
	declare @email nvarchar(500)

	select top 1
		@lastAccessToken = AccessToken,
		@publicUserId = u.PublicId,
		@pictureUri = providers.PictureUri,
		@providerId = providers.OAuthProviderId,
		@externalAccessToken = logins.ExternalAccessToken,
		@firstName = providers.FirstName,
		@lastName = providers.LastName,
		@email = u.Email
	from
		UserOAuthProviderLogins logins
		inner join UserOAuthProviders providers on logins.UserOAuthProviderId = providers.Id
		inner join Users u on providers.UserId = u.Id
	where
		logins.ApplicationOAuthProviderId = @applicationOAuthProviderId
		and logins.UserOAuthProviderId = @userOAuthProviderId
	order by
		LoginDate desc

	if @lastAccessToken <> @accessToken
		return

	select
		@publicUserId as PublicId,
		@email as Email,
		@firstName as FirstName,
		@lastName as LastName,
		@pictureUri as PictureUri,
		@providerId as ProviderId,
		@externalAccessToken as ExternalAccessToken
end