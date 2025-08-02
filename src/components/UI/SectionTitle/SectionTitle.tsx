import './SectionTitle.scss';

const SectionTitle = ({ theme, title }: { theme: { font: string; color: string }; title: string }) => {
    return (
        <h2 className="section-title" style={{ fontFamily: theme.font, color: theme.color }}>{title}</h2>
    );
}

export default SectionTitle;
