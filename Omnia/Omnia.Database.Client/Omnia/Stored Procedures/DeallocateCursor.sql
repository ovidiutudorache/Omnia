create proc Omnia.DeallocateCursor(
	@name nvarchar(max)
)
as
begin
	declare @CursorStatus int

	set @CursorStatus = CURSOR_STATUS('global', @name);
	if (@CursorStatus >= 0) begin
		close c_pontaj_add
		deallocate c_pontaj_add
	end
end