import { div, button } from '../core/dom-api';
import { getData } from '../core/database';
import { ArticleElement } from '../elements/article-element';

export const GenericView = ({ viewClassName, urlName }) => {
    let count = 30;
    let articles = [];
    let template;
    let pageNumber = 0;

    const nextPage = () => {
        pageNumber += 1;
        loadData();
    };

    const loadData = () => {

        getData(urlName, pageNumber * count, (pageNumber + 1) * count)
            .then(res => {
                let nodeArticles = res.map(id => {
                    return ArticleElement({ id });
                });

                if (pageNumber === 0) {
                    articles = nodeArticles.slice();
                    render();
                } else {
                    let refChild = template.querySelector('.more-items');
                    nodeArticles.forEach(node => template.insertBefore(node, refChild));
                }
            });
    };

    const createTemplate = () => {
        return div({
            className: viewClassName
        }, articles.concat([
            button({
                className: 'more-items',
                onclick: nextPage
            }, 'Load more items')
        ]));
    };

    function createFirstTemplate() {
        return div({
            className: viewClassName
        }, '<div class="content-loading">Loading content</div>');
    }

    function render() {
        if (!!template.parentElement) {
            let newTemplate = createTemplate();
            template.parentElement.replaceChild(newTemplate, template);
            template = newTemplate;
        }
    }

    template = createFirstTemplate();

    loadData();

    return template;
};