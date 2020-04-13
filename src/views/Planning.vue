<template>
  <div>
    <div class="page-title">
      <h3>{{'Menu_Planning'|localize}}</h3>
      <h4>{{info.bill | currency('RUB')}}</h4>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">
      {{'NoCategories'|localize}}.
      <router-link to="/categories">{{'AddFirst'|localize}}</router-link>
    </p>

    <section v-else>
      <div v-for="c of categories" :key="c.id">
        <p>
          <strong>{{c.title}}:</strong>
          {{c.spend | currency}} {{'Of'|localize}} {{c.limit | currency}}
        </p>
        <div class="progress" v-tooltip.noloc="c.tooltip">
          <div
            class="determinate"
            :class="[c.progressColor]"
            :style="{width: c.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import currencyFilter from '../filters/currency.filter';
import localizeFilter from '../filters/localize.filter';

export default {
  name: 'planning',

  metaInfo () {
    return {
      title: localizeFilter('Menu_Planning')
    };
  },

  data: () => ({
    loading: true,
    categories: []
  }),

  computed: {
    ...mapGetters(['info'])
  },

  async mounted () {
    const records = await this.$store.dispatch('fetchRecords');
    const categories = await this.$store.dispatch('fetchCategories');

    this.categories = categories.map((c) => {
      const spend = records
        .filter((r) => r.categoryId === c.id)
        .filter((r) => r.type === 'outcome')
        .reduce((acc, record) => {
          acc += +record.amount;
          return acc;
        }, 0);

      const percent = 100 * spend / c.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red';

      const tooltipValue = c.limit - spend;
      const tooltip = `${
        tooltipValue < 0 ? localizeFilter('MoreThan') : localizeFilter('Stayed')
      } ${currencyFilter(Math.abs(tooltipValue))}`;

      return {
        ...c,
        progressColor,
        progressPercent,
        spend,
        tooltip
      };
    });

    this.loading = false;
  }
};
</script>
