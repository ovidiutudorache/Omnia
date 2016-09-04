CREATE proc Omnia.[ImportTable](
	@table nvarchar(500)
)
as
begin
	declare @errorMessage nvarchar(max)

	begin try
		declare @defaultSchema nvarchar(max)
		select @defaultSchema = SCHEMA_NAME()
		if Omnia.GetTableSchema(@table) = @defaultSchema begin
			set @table = replace(@table, @defaultSchema + '.', '')
		end

		declare @canImportTable int
		set @canImportTable = Omnia.CanImportTable(@table)
		if @canImportTable <> 0 begin
			set @errorMessage = 'Cannot import entity ' + @table
			raiserror(@errorMessage, 16, 1)
		end

		declare @primaryKeyColumnName nvarchar(1024)
		select top 1 @primaryKeyColumnName = ColumnName from Omnia.GetPrimaryKeys(Omnia.SolveTableName(@table, 0))

		declare @entityId int

		insert into Omnia.Collections ([Name]) values (@table)
		set @entityId = IDENT_CURRENT('Omnia.Collections')

		declare @columnName nvarchar(250)
		declare @isNullable bit
		declare @length int
		declare @precision int
		declare @scale int
		declare @defaultValue nvarchar(max)
		declare @dataTypeName nvarchar(max)
		declare @isPrimaryKey bit
		declare @dataType int
		declare @description nvarchar(max)
		declare @formula nvarchar(max)
		declare @isPersistent bit
		declare @isSparse bit
		declare @increment numeric(38, 0)
		declare @seed numeric(38, 0)

		declare db_cursor_table cursor for  
			select
				COLUMN_NAME
				, COLUMN_DEFAULT
				, cast(case when IS_NULLABLE = 'YES' then 1 else 0 end as bit)
				, DATA_TYPE
				, CHARACTER_MAXIMUM_LENGTH
				, NUMERIC_PRECISION
				, NUMERIC_SCALE
			from
				INFORMATION_SCHEMA.COLUMNS
			where
				(TABLE_SCHEMA = SCHEMA_NAME() and TABLE_NAME = @table)
				or (TABLE_SCHEMA + '.' + TABLE_NAME = @table)

		open db_cursor_table   
		fetch next from db_cursor_table into @columnName, @defaultValue, @isNullable, @dataTypeName, @length, @precision, @scale

		while @@fetch_status = 0   
		begin
			set @isPrimaryKey = cast(case when @primaryKeyColumnName is not null and @primaryKeyColumnName = @columnName then 1 else 0 end as bit)
			set @dataType = Omnia.GetSqlDataType(@dataTypeName)
			if @dataType is null begin
				set @errorMessage = 'Cannot identity data type for column ' + @columnName
				raiserror(@errorMessage, 16, 1)
			end

			if @dataTypeName not in ('real', 'money', 'float', 'decimal', 'numeric', 'smallmoney') begin
				set @precision = null
				set @scale = null
			end

			set @description = null
			select @description = cast(value as nvarchar(max)) from fn_listextendedproperty ('MS_Description', 'schema', Omnia.GetTableSchema(@table), 'table', Omnia.GetTableName(@table), 'column', @columnName)

			if @defaultValue is not null
				set @defaultValue = SUBSTRING(@defaultValue, 2, len(@defaultValue) - 2)

			set @formula = null
			set @isPersistent = 0
			set @isSparse = 0
			select
				@formula = case when col.is_computed = 1 then col.definition else null end
				, @isPersistent = col.is_persisted
				, @isSparse = col.is_sparse
			FROM
				sys.Computed_columns AS col
				inner join sys.objects AS obj ON col.object_id = obj.object_id
				inner join sys.schemas s on s.schema_id = obj.schema_id
			where
				obj.name = Omnia.GetTableName(@table)
				and s.name = Omnia.GetTableSchema(@table)
				and col.name = @columnName

			if @formula is not null
				set @formula = SUBSTRING(@formula, 2, len(@formula) - 2)

			set @seed = null
			set @increment = null
			SELECT
			@seed = IDENT_SEED(@table)
			, @increment = IDENT_INCR(@table)
			FROM
				INFORMATION_SCHEMA.COLUMNS AS c
			WHERE
				COLUMNPROPERTY(OBJECT_ID(@table), COLUMN_NAME, 'IsIdentity') = 1
				and c.COLUMN_NAME = @columnName

			insert into Omnia.Attributes (Name, CollectionId, IsNullable, IsPrimaryKey, Length, Precision, Scale, Type, DefaultValue, Formula, IsPersistent, Description, Increment, Seed, IsSparse)
			values (@columnName, @entityId, @isNullable, @isPrimaryKey, @length, @precision, @scale, @dataType, @defaultValue, @formula, @isPersistent, @description, @increment, @seed, @isSparse)

			fetch next from db_cursor_table into @columnName, @defaultValue, @isNullable, @dataTypeName, @length, @precision, @scale
		end   

		close db_cursor_table   
		deallocate db_cursor_table

		select @entityId
	end try
    begin catch
		declare @error int, @message nvarchar(2048), @xactState smallint
        select @error = ERROR_NUMBER(), @message = ERROR_MESSAGE(), @xactState = XACT_STATE()

		exec Omnia.DeallocateCursor 'db_cursor_table'

		raiserror(@message, 16, 1)
	end catch
end