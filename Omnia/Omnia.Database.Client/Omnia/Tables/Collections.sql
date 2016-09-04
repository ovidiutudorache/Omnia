CREATE TABLE [Omnia].[Collections] (
    [Id]   INT              IDENTITY (1, 1) NOT NULL,
    [SId]  UNIQUEIDENTIFIER CONSTRAINT [DF_Collections_SId] DEFAULT (newid()) NOT NULL,
    [Name] NVARCHAR (250)   NOT NULL,
    CONSTRAINT [PK_Collections] PRIMARY KEY CLUSTERED ([Id] ASC)
);

