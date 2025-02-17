interface ItemInfoRowProps {
  title: string;
  value: string;
}
export const ItemInfoRow: React.FC<ItemInfoRowProps> = ({ title, value }) => (
  <div className="flex justify-between">
    <p className="text-sm text-body">{title}</p>
    <span className="text-sm text-[#000] font-bold text-end">{value}</span>
  </div>
);
