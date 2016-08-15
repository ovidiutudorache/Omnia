CREATE TABLE [dbo].[UserOAuthProviders] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [UserId]          INT            NOT NULL,
    [OAuthProviderId] INT            NOT NULL,
    [ExternalId]      NVARCHAR (500) NOT NULL,
    [FirstName]       NVARCHAR (500) NULL,
    [LastName]        NVARCHAR (500) NULL,
    [PictureUri]      NVARCHAR (500) NULL,
    [DateAdded]       DATETIME       CONSTRAINT [DF_UserOAuthProviders_DateAdded] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_UserOAuthProviders] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserOAuthProviders_OAuthProviders] FOREIGN KEY ([OAuthProviderId]) REFERENCES [dbo].[OAuthProviders] ([Id]),
    CONSTRAINT [FK_UserOAuthProviders_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [UQ_UserOAuthProviders_OAuthProviderId_ExternalId]
    ON [dbo].[UserOAuthProviders]([OAuthProviderId] ASC, [ExternalId] ASC);

