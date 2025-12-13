import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CHARTJS from '@salesforce/resourceUrl/chart2';
import { showToast } from 'c/utilities';

export default class ShowDataChart extends LightningElement {
    @api type;
    @api listOfData;
    customDataLabels;
    sets;
    isLoading = true;
    
    connectedCallback() {
        this.buildCustomDataLabels();
        this.buildSets();
        this.loadChartScript();
    }

    initChart() {
        const container = this.template.querySelector('canvas.container');
        const ctx = container.getContext('2d');
        new Chart(ctx, {
            type: this.type,
            data: {
                labels: this.customDataLabels,
                datasets: this.sets
            }, 
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }

    buildCustomDataLabels() {
        const labelSet = new Set();
        for (const listItem of this.listOfData) {
            for (const item of listItem) {
                labelSet.add(item.DateLabel);
            }
        }
        this.customDataLabels = Array.from(labelSet);
    }

    buildSets() {
        const dataSets = [];
        for (const listItem of this.listOfData) {
            const dataSet = {
                type: listItem[0].Type,
                label: listItem[0].ChartLabel,
                data: listItem.map(r => r.Amount.toFixed(2)),
                pointBackgroundColor: listItem.map(point => point.PointBackColor),
                backgroundColor: listItem[listItem.length - 1].BackColor,
                borderWidth: 1
            }
            dataSets.push(dataSet);
        }
        this.sets = dataSets;
    }

    async loadChartScript() {
        try {
            await loadScript(this, CHARTJS);
            setTimeout(() => {
                this.isLoading = false;
            }, 1000);
        } catch (error) {
            const errorMessage = error?.body?.message ?? 'Something when wrong loading Chart library';
            showToast('Error', errorMessage, 'error', this);
        }
    }

    @api
    refreshChart() {
        this.buildCustomDataLabels();
        this.buildSets();
        this.initChart();
    }

    renderedCallback() {
        if(!this.isLoading) {
            this.initChart();
        }
    }
}