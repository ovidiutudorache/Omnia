CREATE TABLE [dbo].[Users] (
    [Id]        INT              IDENTITY (1, 1) NOT NULL,
    [PublicId]  UNIQUEIDENTIFIER CONSTRAINT [DF_Users_PublicId] DEFAULT (newid()) NOT NULL,
    [Email]     NVARCHAR (250)   NULL,
    [DateAdded] DATETIME         CONSTRAINT [DF_Users_DateAdded] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);

