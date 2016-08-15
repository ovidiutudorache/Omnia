CREATE TABLE [dbo].[Applications] (
    [Id]          INT              IDENTITY (1, 1) NOT NULL,
    [PublicId]    UNIQUEIDENTIFIER CONSTRAINT [DF_Applications_PublicId] DEFAULT (newid()) NOT NULL,
    [Name]        NVARCHAR (50)    NOT NULL,
    [PrivateKey]  NVARCHAR (250)   NULL,
    [RedirectUrl] NVARCHAR (250)   NULL,
    CONSTRAINT [PK_Applications] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [UQ_Applications_PublicId]
    ON [dbo].[Applications]([PublicId] ASC);


GO
CREATE TRIGGER [TRG_Applications_I]
   ON  [dbo].[Applications]
   AFTER insert
AS 
BEGIN
	SET NOCOUNT ON;

	declare @id int

    DECLARE applications_inserted_cursor CURSOR FOR  
	SELECT
		Id 
	FROM inserted

	OPEN applications_inserted_cursor   
	FETCH NEXT FROM applications_inserted_cursor INTO @id   

	WHILE @@FETCH_STATUS = 0   
	BEGIN   
			declare @key nvarchar(250)
			set @key = replace(cast(newid() as nvarchar(max)) + cast(newid() as nvarchar(max)), '-', '')
			update Applications set PrivateKey = @key where Id = @id

		   FETCH NEXT FROM applications_inserted_cursor INTO @id
	END   

	CLOSE applications_inserted_cursor   
	DEALLOCATE applications_inserted_cursor

END
